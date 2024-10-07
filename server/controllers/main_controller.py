from flask import jsonify
from models.unit import Unit
from models.venue import Venue
from models.session import Session
from models.unitSession import UnitSession
import time

from .utils.timetabling_functions import (
    get_timeslot_index,
    initialize_venue_index_map,
    parse_blocked_timeslots,
    build_non_clashing_units_map,
    calculate_num_session_needed,
    delete_existing_sessions,
    find_available_venue,
    generate_session,
    assign_session_to_timetable,
)

is_completed = False

def generate_recursively(iteration, total_sessions_needed,
                         venues, venue_index_map,
                         units, non_clashing_units, unit_sessions_expanded,
                         timetable, marker_unit_sessions):
    global is_completed

    if iteration >= (65 * len(venues)):
        is_completed = True
        return 0

    if total_sessions_needed <= 0:
        is_completed = True
        return 0

    sessions_scheduled = 0
    for idx, item in enumerate(unit_sessions_expanded):
        if marker_unit_sessions[idx]:
            continue

        if is_completed:
            break

        unit = item["unit"]
        unit_session = item["unit_session"]

        print(
            f"Attempting to schedule {unit_session.session_type} session for unit {unit.id} - {unit.unitCode}"
        )

        venue_id, day_of_week, start_hour = find_available_venue(
            unit,
            unit_session.session_type,
            unit_session.duration_hours,
            unit_session.capacity,
            unit_session.get_equipment_types(),
            venues,
            venue_index_map,
            timetable,
            non_clashing_units,
        )

        if venue_id is not None:
            if generate_session(
                unit.id,
                unit.unitCode,
                venue_id,
                unit_session.id,
                unit_session.session_type,
                unit_session.duration_hours,
                unit_session.capacity,
                timetable[venue_index_map[venue_id]],
                timetable,
                venues,
                venue_index_map,
                parse_blocked_timeslots(
                    Venue.query.filter_by(id=venue_id).first().blocked_timeslots
                ),
                non_clashing_units,
                unit.staffId if unit_session.session_type == "lecture" else None,
            ):
                sessions_scheduled += 1
                print(
                    f"Scheduled session for {unit.id} - {unit.unitCode} at {day_of_week}, {start_hour}:00."
                )

        else:
            print(
                f"Failed to schedule {unit_session.session_type} session for unit {unit.id} - {unit.unitCode} due to unavailable venue."
            )

        marker_unit_sessions[idx] = True

        sessions_scheduled += generate_recursively(
            iteration + 1,
            total_sessions_needed - sessions_scheduled,
            venues,
            venue_index_map,
            units,
            non_clashing_units,
            unit_sessions_expanded,
            timetable,
            marker_unit_sessions
        )

        marker_unit_sessions[idx] = False

        if is_completed:
            break

    return sessions_scheduled


def generate_backtrack_with_brute_force():
    global is_completed

    delete_existing_sessions()

    units = Unit.query.all()
    venues = Venue.query.filter_by(active=True).order_by(Venue.capacity).all() #sorting improves the venue optimization
    unit_sessions_expanded = []

    if not venues:
        print("No venues available in the database.")
        return jsonify([]), 200

    start = time.time()
    total_sessions_needed = 0
    actual_sessions_allocated = 0
    #flag to check for tracking
    is_completed = False 

    for unit in units:
        filtered_unit_sessions = UnitSession.query.filter_by(unit_id=unit.id).order_by(UnitSession.capacity).all() #sorting to improve the venue optimization

        for us in filtered_unit_sessions:
            sessions_needed = calculate_num_session_needed(
                unit.quota, us.capacity
            )
            data = {
                "unit": unit,
                "unit_session": us,
            }
            #expanding with the sessions needed for that unit to check flag in future 
            unit_sessions_expanded.extend([data] * sessions_needed) 
            total_sessions_needed += sessions_needed

    timetable = [[None] * 65 for _ in range(len(venues))]
    # needed to check for the expanded unit sessions are scheduled or not
    marker_unit_sessions = [False] * len(unit_sessions_expanded)
    venue_index_map = initialize_venue_index_map()
    non_clashing_units = build_non_clashing_units_map()

    actual_sessions_allocated = generate_recursively(
        0,
        total_sessions_needed,
        venues,
        venue_index_map,
        units,
        non_clashing_units,
        unit_sessions_expanded,
        timetable,
        marker_unit_sessions
    )

    response = {
        "message": "Timetable generated successfully.",
        "total_sessions_needed": total_sessions_needed,
        "actual_sessions_allocated": actual_sessions_allocated,
    }

    end = time.time()
    print("\nBacktrack elapsed time = " + str(end - start) + " s\n")

    return jsonify(response), 200

def generate_brute_force():
    delete_existing_sessions()

    units = Unit.query.all()
    venues = Venue.query.filter_by(active=True).all()

    if not venues:
        print("No venues available in the database.")
        return jsonify([]), 200

    start = time.time()
    timetable = [[None] * 65 for _ in range(len(venues))]
    venue_index_map = initialize_venue_index_map()
    non_clashing_units = build_non_clashing_units_map()

    total_sessions_needed = 0
    actual_sessions_allocated = 0

    for unit in units:
        unit_sessions = UnitSession.query.filter_by(unit_id=unit.id).all()
        session_requirements = {}

        for us in unit_sessions:
            session_requirements[us.session_type] = {
                "unit_session_id": us.id,
                "duration_hours": us.duration_hours,
                "capacity": us.capacity,
                "equipment_types": us.get_equipment_types(),
                "sessions_needed": calculate_num_session_needed(
                    unit.quota, us.capacity
                ),
            }

        total_sessions_needed += sum(
            req["sessions_needed"] for req in session_requirements.values()
        )

        for session_type, req in session_requirements.items():
            sessions_scheduled = 0
            print(
                f"Attempting to schedule {req['sessions_needed']} {session_type} sessions for unit {unit.id} - {unit.unitCode}"
            )

            while sessions_scheduled < req["sessions_needed"]:
                venue_id, day_of_week, start_hour = find_available_venue(
                    unit,
                    session_type,
                    req["duration_hours"],
                    req["capacity"],
                    req["equipment_types"],
                    venues,
                    venue_index_map,
                    timetable,
                    non_clashing_units,
                )

                if venue_id is not None:
                    if generate_session(
                        unit.id,
                        unit.unitCode,
                        venue_id,
                        req["unit_session_id"],
                        session_type,
                        req["duration_hours"],
                        req["capacity"],
                        timetable[venue_index_map[venue_id]],
                        timetable,
                        venues,
                        venue_index_map,
                        parse_blocked_timeslots(
                            Venue.query.filter_by(id=venue_id).first().blocked_timeslots
                        ),
                        non_clashing_units,
                        unit.staffId if session_type == "lecture" else None,
                    ):
                        sessions_scheduled += 1
                        actual_sessions_allocated += 1
                        print(
                            f"Scheduled session for {unit.id} - {unit.unitCode} at {day_of_week}, {start_hour}:00."
                        )

                else:
                    print(
                        f"Failed to schedule {session_type} session for unit {unit.id} - {unit.unitCode} due to unavailable venue."
                    )
                    break

            if sessions_scheduled < req["sessions_needed"]:
                print(
                    f"Could not schedule all required {session_type} sessions for unit {unit.id} - {unit.unitCode}."
                )

    response = {
        "message": "Timetable generated successfully.",
        "total_sessions_needed": total_sessions_needed,
        "actual_sessions_allocated": actual_sessions_allocated,
    }

    end = time.time()
    print("\nBruteforce elapsed time = " + str(end - start) + " s\n")

    return jsonify(response), 200

def fetch_timetable():
    sessions = Session.query.all()
    actual_sessions_allocated = Session.query.count()
    venues = Venue.query.all()
    venue_index_map = {venue.id: index for index, venue in enumerate(venues)}
    timetable = [[None] * 65 for _ in range(len(venues))]

    # Total sessions needed calculation
    total_sessions_needed = 0
    units = Unit.query.all()

    for unit in units:
        unit_sessions = UnitSession.query.filter_by(unit_id=unit.id).all()
        for us in unit_sessions:
            sessions_needed = calculate_num_session_needed(unit.quota, us.capacity)
            total_sessions_needed += sessions_needed

    for session in sessions:
        start_index = get_timeslot_index(session.dayOfTheWeek, session.startTime.hour)
        session_details = {
            "unitCode": session.unit.unitCode,
            "sessionType": session.unitSession.session_type,
            "equipmentType": session.unitSession.get_equipment_types(),
            "durationHours": session.unitSession.duration_hours,
            "dayOfWeek": session.dayOfTheWeek,
            "startTime": session.startTime.strftime("%H:%M"),
            "endTime": session.endTime.strftime("%H:%M"),
            "staffName": (
                f"{session.staff.firstname} {session.staff.lastname}"
                if session.staff
                else "No staff assigned"
            ),
            "venueName": session.venue.name,
            "venueLocation": session.venue.location,
            "capacity": session.unitSession.capacity,
            "unitId": session.unitId,
            "staffId": session.staffId,
            "venueId": session.venueId,
            "unitsessionId": session.unitsessionId,
        }
        assign_session_to_timetable(
            timetable,
            venue_index_map[session.venueId],
            start_index,
            session.unitSession.duration_hours,
            session_details,
        )

    response = {
        "timetable": timetable,
        "actual_sessions_allocated": actual_sessions_allocated,
        "total_sessions_needed": total_sessions_needed,
    }

    return jsonify(response), 200
