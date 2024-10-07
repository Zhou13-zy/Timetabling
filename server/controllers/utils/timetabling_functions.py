from models.venue import Venue
from datetime import time
import math
from models.clash_free_set import Clash_Free_Set
from models.staff import Staff
from models.session import Session
from models import db

def get_timeslot_index(day, hour):
    """Calculates the index for the timeslot array based on the day and hour."""
    day_to_index = {
        "monday": 0,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 3,
        "friday": 4,
    }
    return day_to_index[day.lower()] * 13 + (hour - 8)


def initialize_venue_index_map():
    """Maps venueId to real index in the timetable 2D array."""
    venues = Venue.query.filter_by(active=True).all()
    return {venue.id: index for index, venue in enumerate(venues)}


def parse_blocked_timeslots(blocked_str):
    """Parses the blocked timeslots string and returns a list of indices."""
    if not blocked_str:
        return []
    return [get_timeslot_index(*item.split("-")) for item in blocked_str.split(",")]


def check_no_clashes(
    timetable, non_clashing_units, current_unit_code, start_index, end_index
):
    """Checks if the given timeslot range has any session clashes."""
    if not non_clashing_units:
        return True  # Assume no clashes if no mapping is provided

    for venue_timetable in timetable:
        for i in range(start_index, end_index):
            session = venue_timetable[i]
            if session and session["unitCode"] in non_clashing_units.get(
                current_unit_code, []
            ):
                return False
    return True


def find_next_available_timeslot(
    unit_sessions,
    duration_hours,
    timetable,
    venues,
    venue_blocked_timeslots,
    non_clashing_units=None,
    current_unit_code=None,
):
    """Finds the first available timeslot without conflicts."""
    operational_hours = range(8, 22 - duration_hours)
    days_of_week = ["monday", "tuesday", "wednesday", "thursday", "friday"]

    for day in days_of_week:
        for hour in operational_hours:
            start_index = get_timeslot_index(day, hour)
            end_index = start_index + duration_hours

            if any(
                idx in venue_blocked_timeslots for idx in range(start_index, end_index)
            ):
                continue  # Skip blocked timeslots

            get_out = False
            if current_unit_code is not None:
                for venueIdx, venue in enumerate(venues):
                    if get_out:
                        break

                    for timeIdx in range(start_index, end_index):
                        if get_out:
                            break

                        assigned_session = timetable[venueIdx][timeIdx]
                        if (assigned_session is not None) and (current_unit_code == assigned_session["unitCode"]):
                            get_out = True
                            continue

            if get_out:
                continue

            if all(
                slot is None for slot in unit_sessions[start_index:end_index]
            ) and check_no_clashes(
                timetable, non_clashing_units, current_unit_code, start_index, end_index
            ):
                return day, hour

    return None, None


def assign_session_to_timetable(
    timetable, venue_index, start_index, duration_hours, session_details
):
    """Assigns session details to the timetable for the specified duration."""
    for i in range(duration_hours):
        timetable[venue_index][start_index + i] = session_details


def create_session(
    unit_id,
    staff_id,
    venue_id,
    unit_session_id,
    session_type,
    capacity,
    day_of_week,
    start_time,
    end_time,
):
    """Creates a new session record in the database."""
    new_session = Session(
        unitId=unit_id,
        staffId=staff_id,
        venueId=venue_id,
        unitsessionId=unit_session_id,
        type=session_type,
        capacity=capacity,
        dayOfTheWeek=day_of_week,
        startTime=start_time,
        endTime=end_time,
    )
    db.session.add(new_session)
    db.session.commit()
    return new_session


def calculate_num_session_needed(unit_quota, session_capacity):
    """Calculates the number of sessions needed based on the unit's quota and capacity."""
    return math.ceil(unit_quota / session_capacity)


def build_non_clashing_units_map():
    """Builds a map of units to their non-clashing units based on clash-free sets."""
    clash_free_sets = Clash_Free_Set.query.all()
    non_clashing_units = {}

    for cfs in clash_free_sets:
        units_in_set = cfs.set.split(", ")
        for i, unit in enumerate(units_in_set):
            non_clashing_units.setdefault(unit, set()).update(
                units_in_set[:i] + units_in_set[i + 1 :]
            )

    return {unit: list(units) for unit, units in non_clashing_units.items()}


def find_available_venue(
    unit,
    session_type,
    duration_hours,
    capacity,
    required_equipment_types,
    venues,
    venue_index_map,
    timetable,
    non_clashing_units,
):
    """Finds an available venue that meets the specified constraints, preferring venues without equipment types for sessions without equipment requirements."""
    # Separate venues into those with and without equipment types
    venues_without_equipment = []
    venues_with_equipment = []

    for venue in venues:
        if venue.capacity < capacity:
            continue

        if venue.get_equipment_types():
            venues_with_equipment.append(venue)
        else:
            venues_without_equipment.append(venue)

    # First, try to find a venue without equipment types
    if not required_equipment_types:
        for venue in venues_without_equipment:
            venue_blocked_timeslots = parse_blocked_timeslots(venue.blocked_timeslots)
            unit_sessions = timetable[venue_index_map[venue.id]]

            day_of_week, start_hour = find_next_available_timeslot(
                unit_sessions,
                duration_hours,
                timetable,
                venues,
                venue_blocked_timeslots,
                non_clashing_units,
                unit.unitCode,
            )

            if day_of_week is not None:
                return venue.id, day_of_week, start_hour

    # If no suitable venue without equipment types is found, or if equipment is required, try venues with equipment types
    for venue in venues_with_equipment:
        venue_equipment_types = venue.get_equipment_types()

        if required_equipment_types:
            if not all(
                equipment in venue_equipment_types
                for equipment in required_equipment_types
            ):
                continue  # Skip this venue if it doesn't have all required equipment types

        venue_blocked_timeslots = parse_blocked_timeslots(venue.blocked_timeslots)
        unit_sessions = timetable[venue_index_map[venue.id]]

        day_of_week, start_hour = find_next_available_timeslot(
            unit_sessions,
            duration_hours,
            timetable,
            venues,
            venue_blocked_timeslots,
            non_clashing_units,
            unit.unitCode,
        )

        if day_of_week is not None:
            return venue.id, day_of_week, start_hour

    # If no venue is found, return None
    return None, None, None


def delete_existing_sessions():
    """Deletes all existing sessions in the database."""
    try:
        num_deleted = db.session.query(Session).delete()
        db.session.commit()
        print(f"Deleted {num_deleted} sessions.")
    except Exception as e:
        db.session.rollback()
        print(f"Failed to delete sessions: {e}")


def is_staff_available(staff_id, day_of_week, start_time, end_time):
    """Check if the staff member is available for the given time slot."""
    conflicting_sessions = (
        Session.query.filter_by(staffId=staff_id, dayOfTheWeek=day_of_week)
        .filter((Session.startTime < end_time) & (Session.endTime > start_time))
        .all()
    )

    return len(conflicting_sessions) == 0


def try_schedule_session(
    unit_id,
    unit_code,
    venue_id,
    unit_session_id,
    session_type,
    duration_hours,
    capacity,
    timetable,
    venue_index_map,
    staff_id,
    day_of_week,
    start_hour,
):
    """Attempts to schedule a session at the given time slot."""
    end_hour = (start_hour + duration_hours) % 24
    start_time = time(start_hour % 24, 0)
    end_time = time(end_hour % 24, 0)

    if session_type == "lecture" and staff_id:
        # Check if the staff member is available for lectures
        if not is_staff_available(staff_id, day_of_week, start_time, end_time):
            print(
                f"Staff member {staff_id} is not available for the lecture at {day_of_week}, {start_time}-{end_time}."
            )
            return False  # Staff not available at this time

    # Create the session even if no staff is assigned for non-lecture types
    create_session(
        unit_id,
        staff_id if session_type == "lecture" else None,
        venue_id,
        unit_session_id,
        session_type,
        capacity,
        day_of_week,
        start_time,
        end_time,
    )

    start_index = get_timeslot_index(day_of_week, start_hour)
    staff = db.session.get(Staff, staff_id) if staff_id else None
    venue = db.session.get(Venue, venue_id) if venue_id else None

    session_details = {
        "unitCode": unit_code,
        "sessionType": session_type,
        "durationHours": duration_hours,
        "dayOfWeek": day_of_week,
        "startTime": start_time.strftime("%H:%M"),
        "endTime": end_time.strftime("%H:%M"),
        "staffName": (
            f"{staff.firstname} {staff.lastname}"
            if staff_id and session_type == "lecture"
            else "No staff assigned"
        ),
        "venueName": venue.name if venue else "Unknown Venue",
        "venueLocation": venue.location if venue else "Unknown Location",
        "equipmentType": (
            ",".join(venue.get_equipment_types()) if venue else ""
        ),
    }

    assign_session_to_timetable(
        timetable,
        venue_index_map[venue_id],
        start_index,
        duration_hours,
        session_details,
    )

    return True


def generate_session(
    unit_id,
    unit_code,
    venue_id,
    unit_session_id,
    session_type,
    duration_hours,
    capacity,
    unit_sessions,
    timetable,
    venues,
    venue_index_map,
    venue_blocked_timeslots,
    non_clashing_units,
    staff_id=None,
):
    """Attempts to schedule a session for a unit within the given timetable."""
    original_day_of_week, original_start_hour = find_next_available_timeslot(
        unit_sessions,
        duration_hours,
        timetable,
        venues,
        venue_blocked_timeslots,
        non_clashing_units,
        unit_code,
    )

    if original_day_of_week is None:
        print(
            f"Failed to find a timeslot for {unit_id} {unit_code} with session type {session_type} in venue {venue_id}."
        )
        return False

    # Attempt to schedule at the original time
    scheduled = try_schedule_session(
        unit_id,
        unit_code,
        venue_id,
        unit_session_id,
        session_type,
        duration_hours,
        capacity,
        timetable,
        venue_index_map,
        staff_id,
        original_day_of_week,
        original_start_hour,
    )

    # If scheduling failed due to staff availability (for lectures), try to reschedule
    if not scheduled and session_type == "lecture":
        for day in ["monday", "tuesday", "wednesday", "thursday", "friday"]:
            for hour in range(8, 22 - duration_hours):
                if day == original_day_of_week and hour == original_start_hour:
                    continue  # Skip the original time slot

                start_index = get_timeslot_index(day, hour)
                end_index = start_index + duration_hours

                # Ensure the new slot is available and has no clashes
                if all(
                    slot is None for slot in unit_sessions[start_index:end_index]
                ) and check_no_clashes(
                    timetable, non_clashing_units, unit_code, start_index, end_index
                ):
                    scheduled = try_schedule_session(
                        unit_id,
                        unit_code,
                        venue_id,
                        unit_session_id,
                        session_type,
                        duration_hours,
                        capacity,
                        timetable,
                        venue_index_map,
                        staff_id,
                        day,
                        hour,
                    )
                    if scheduled:
                        print(
                            f"Rescheduled lecture for {unit_id} - {unit_code} to {day}, {hour}:00."
                        )
                        return True

        print(f"Failed to reschedule lecture session for unit {unit_id} - {unit_code}.")
        return False  # Could not find an alternative time slot

    return scheduled
