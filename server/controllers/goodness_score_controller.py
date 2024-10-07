from flask import jsonify, request
from models.unit import Unit
from models.venue import Venue
from models.session import Session
from models.clash_free_set import Clash_Free_Set
import math

from .main_controller import build_non_clashing_units_map


def calculate_goodness_score():

    # Default weights
    default_weights = {
        "venue_optimization_weight": 0.4,
        "unit_conflict_weight": 0.6,
        # Add more default weights here as needed
    }

    # Get JSON data from the request body
    data = request.get_json()

    # Extract weights from the JSON data
    input_weights = data.get("weights", {}) if data else {}

    # Merge defaults with input weights (input_weights will overwrite defaults if provided)
    weights = {**default_weights, **input_weights}

    # Extract specific weights
    venue_optimization_weight = weights.get("venue_optimization_weight")
    unit_conflict_weight = weights.get("unit_conflict_weight")

    venue_optimization_score = calculate_venue_optimization_score()
    venue_optimization_final_score = (
        venue_optimization_weight * venue_optimization_score
    )

    unit_conflict_score = calculate_unit_conflict_score()
    unit_conflict_final_score = (unit_conflict_weight * unit_conflict_score) * 100

    goodness_score = round(
        (venue_optimization_final_score + unit_conflict_final_score), 2
    )

    response = {
        "message": "Data retrieved successfully",
        "venue_optimization_final_score": venue_optimization_final_score,
        "unit_conflict_final_score": unit_conflict_final_score,
        "goodness_score": goodness_score,
    }

    return jsonify(response), 200


def calculate_venue_optimization_score():
    session_venues = Session.get_all_session_venues_capacity()
    total_sessions = len(session_venues)
    total_score = sum(item["score"] for item in session_venues)
    if total_sessions != 0:
        venue_optimization_final_score = round((total_score / total_sessions), 2)
    else:
        venue_optimization_final_score = 0

    return venue_optimization_final_score


def calculate_unit_conflict_score():
    fetch_timeslot_data = get_available_timeslots()
    available_timeslot_count = sum(fetch_timeslot_data.values())
    non_clashing_unit = non_clashing_units_count()
    non_clashing_unit_count = sum(non_clashing_unit.values())

    calculate_all_possible_time_conflicts_count = calculate_all_possible_combination(
        available_timeslot_count, non_clashing_unit_count
    )
    existing_conflict = calculate_time_conflicts()

    if calculate_all_possible_time_conflicts_count != 0:
        score = 1 - round(
            (existing_conflict / calculate_all_possible_time_conflicts_count), 2
        )
    else:
        score = 0

    return score


def calculate_all_possible_combination(total_n, m):
    if total_n < m:
        return 0  # If n is less than m, no combinations are possible

    # Calculate the binomial coefficient (n choose m)
    num_combinations = math.comb(total_n, m)

    return num_combinations


def fetch_unit_ids():

    clash_free_set = build_non_clashing_units_map()

    unit_ids = {}
    # Iterate over each set and its associated unit codes
    for set_id, unit_codes in clash_free_set.items():
        # Fetch the unit ID for the set ID
        set_unit = Unit.query.filter_by(unitCode=set_id).first()
        if set_unit:
            unit_ids[set_unit.id] = []
            # Fetch the unit IDs for each unit code
            for unit_code in unit_codes:
                unit = Unit.query.filter_by(unitCode=unit_code).first()
                if unit:
                    unit_ids[set_unit.id].append(unit.id)

    return unit_ids


def calculate_time_conflicts():

    clash_free_units = fetch_unit_ids()
    clash_count = 0

    # Fetch all sessions once
    all_sessions = Session.query.filter(Session.type != "lecture").all()

    for unit_code, value_codes in clash_free_units.items():
        unit_sessions = [
            session for session in all_sessions if session.unitId == unit_code
        ]

        for value_code in value_codes:
            value_sessions = [
                session for session in all_sessions if session.unitId == value_code
            ]

            for unit_session in unit_sessions:
                for value_session in value_sessions:
                    if unit_session.dayOfTheWeek == value_session.dayOfTheWeek:
                        if (
                            unit_session.startTime < value_session.endTime
                            and unit_session.endTime > value_session.startTime
                        ):
                            clash_count += 1

    return clash_count


def non_clashing_units_count():
    # Retrieve all Clash_Free_Set instances from the database at once
    clash_free_sets = Clash_Free_Set.query.all()

    # This dictionary will store each unit code as a key and the count of non-clashing units as the value
    non_clashing_units_count = {}

    # Iterate over each set in the database
    for cfs in clash_free_sets:
        units_in_set = cfs.set.split(", ")

        # Update the dictionary for each unit in the set
        for unit in units_in_set:
            # Add the unit to the dictionary if it's not already present
            if unit not in non_clashing_units_count:
                non_clashing_units_count[unit] = 0

            # Add the count of non-clashing units for the current unit
            non_clashing_units_count[unit] += len(units_in_set)

    return non_clashing_units_count


def get_available_timeslots():
    # Define the list of days and hours
    days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    hours = [str(hour) for hour in range(8, 21)]  # Hours from 8 am to 8 pm

    # Generate all possible time slots
    all_timeslots = [f"{day}-{hour}" for day in days for hour in hours]

    # Retrieve all Venue instances from the database
    venues = Venue.query.all()

    # Dictionary to store available time slots for each venue
    available_timeslots = {}

    # Iterate over each venue
    for venue in venues:
        # Parse the blocked_timeslots field
        blocked_timeslots = venue.blocked_timeslots.split(", ")

        # Calculate available time slots by subtracting blocked time slots from all time slots
        available = [slot for slot in all_timeslots if slot not in blocked_timeslots]

        # Store available time slots for the current venue
        available_timeslots[venue.name] = len(available)

    return available_timeslots
