import json
from flask import jsonify
from models import db
from models.generation import Generation, PopulationSession
from models.session import Session
from models.unit import Unit
from models.unitSession import UnitSession
from models.venue import Venue
import math
import time
from typing import Any, Tuple


from .utils.timetabling_functions_ga import (
    delete_existing_sessions,
    query_tables,
    generate_clash_map,
    parse_blocked_timeslots,
    print_generation_fitness,
    calculate_sessions_needed,
    get_timeslot_index,
    populate_sessions_db,
    assign_session_to_timetable,
    GeneticAlgorithm,
)
from .utils.ga_visualisation import (
    visualize_sessions_across_venues,
    visualize_sessions_across_timeslots,
    visualize_sessions_freq_by_day_hour,
    visualize_hyperparam_tuning_impact,
    # visualize_fitness_landscape,
    visualize_constraint_satisfaction,
    visualize_num_of_generations,
    visualize_convergence_rate,
    visualize_solution_quality,
    visualize_diversity_of_solutions
)
from .utils.timetabling_functions_ga import (
    TOTAL_HOURS_IN_DAY,
    TOTAL_HOURS_IN_WEEK
)


def __run_ga_algo(
    max_gen_idx: int = 1000,
    max_population_count: int = 10,
    mutation_rate: float = 0.1,
    print_fitness_log: bool = False
) -> Tuple[list[Generation], float]:
    gen_idx = 1
    all_generations: list[Generation] = []
    start = time.time()

    print(f"Starting Genetic Algo ({max_gen_idx = }, {max_population_count = })...")
    print()

    ga = GeneticAlgorithm(
        max_population_count = max_population_count,
        mutation_rate = mutation_rate
    )
    generation = ga.generate_single_generation()
    ga.sort_generation(generation)
    all_generations.append(generation)
    if print_fitness_log: print_generation_fitness(generation, gen_idx)

    while True:
        gen_idx += 1
        generation = ga.evolve(generation)
        ga.sort_generation(generation)
        all_generations.append(generation)
        if print_fitness_log: print_generation_fitness(generation, gen_idx)

        #if gen_idx >= max_gen_idx:
        #    break
        if generation.populations[0].fitness.score >= 100:
            break

    end = time.time()

    print()
    if generation.populations[0].fitness.score >= 100:
        print(f"Genetic Algo completed successfully with a score of 100 with zero conflicts")
        print(f"Genetic Algo total generations needed = {gen_idx}")
    else:
        print(f"Genetic Algo generated {max_gen_idx} generations, but couldn't achieve 100 score. There are still some conflicts.")
        print(f"The best solution generated has a score of {generation.populations[0].fitness.score} with {generation.populations[0].fitness.total_conflict_count} conflicts remaining.")
    print(f"The best population/timetable has in total {len(generation.populations[0].sessions)} sessions")
    print(f"Genetic Algo all generation elapsed time = {end - start} s")

    return all_generations, end - start


def __get_timetable_by_venues_by_timeslots(
    venues: list[Venue],
    population_sessions: list[PopulationSession]
) -> list[list[list[PopulationSession]]]:
    timetable: list[list[list[PopulationSession]]] = [
        [[] for _ in range(TOTAL_HOURS_IN_WEEK)]
        for _ in range(len(venues))
    ]
    venue_index_map: dict[str, int] = {venue.id: index for index, venue in enumerate(venues)}

    for s in population_sessions:
        for i in range(s.unit_session.duration_hours):
            venue_idx = venue_index_map[s.venue.id]
            timeslot_idx = s.timeslot_idx + i
            if timetable[venue_idx][timeslot_idx] is None:
                timetable[venue_idx][timeslot_idx] = [s]
            else:
                timetable[venue_idx][timeslot_idx].append(s)

    return timetable


def __visualize_ga_algo(
    multiple_runs_data: dict[str, Any]
) -> None:
    print(f"Creating Genetic Algo visualisations...")
    print()

    start = time.time()
    units = Unit.query.all()
    venues = Venue.query.filter_by(active=True).order_by(Venue.capacity).all()

    all_generations_in_all_runs: list[list[Generation]] = [d["all_generations"] for d in multiple_runs_data.values()]
    single_run = all_generations_in_all_runs[-1]
    timetable_by_venues_by_timeslots = __get_timetable_by_venues_by_timeslots(
        venues,
        single_run[-1].populations[0].sessions
        # single_run[-1] means the last generation of that run,
        # populations[0] means population with the highest fitness score
        # So basically, single_run[-1].populations[0] means the best population in the last generation,
        # which is the final result of the GA actually
        # Similarly, single_run[0].populations[-1] will mean the worst population in the initial/first generation
    )

    # Graph 1-3
    visualize_sessions_across_venues(venues, timetable_by_venues_by_timeslots)
    visualize_sessions_across_timeslots(venues, timetable_by_venues_by_timeslots)
    visualize_sessions_freq_by_day_hour(venues, timetable_by_venues_by_timeslots)

    max_population_counts: list[int] = [d["max_population_count"] for d in multiple_runs_data.values()]
    avg_fitness_scores: list[float] = []
    for run in all_generations_in_all_runs:
        avg_score: float = 0
        n = 0

        for g in run:
            all_pops = g.populations
            avg_score += sum([p.fitness.score for p in all_pops])
            n += len(g.populations)

        avg_score /= n
        avg_fitness_scores.append(avg_score)

    # Graph 4: Hyperparameter tuning impact
    visualize_hyperparam_tuning_impact(
        population_sizes = max_population_counts,
        average_fitness_scores = avg_fitness_scores
    )

    # Graph 5: Visualisation of fitness landscape
    # [skiped]

    # Graph 6: Constraint satisfaction
    visualize_constraint_satisfaction(single_run)

    # Graph 7: Number of generations
    visualize_num_of_generations(multiple_runs_data)

    # Graph 8: Convergence rate
    visualize_convergence_rate(multiple_runs_data)

    # Graph 9: Solution quality
    visualize_solution_quality(multiple_runs_data)

    # Graph 10: Diversity of solutions
    visualize_diversity_of_solutions(
        all_generations = all_generations_in_all_runs[0],
        population_size = max_population_counts[0]
    )

    end = time.time()

    print()
    print(f"Genetic Algo visualisation elapsed time = {end - start} s")


def generate_ga():
    print()
    delete_existing_sessions()
    query_tables()
    generate_clash_map()

    max_gen_idx = 1000
    max_population_counts = [i for i in range(10, 101, 10)]
    multiple_runs_data = {}

    # Run Genetic Algorithm with various hyperparams and store data for later use
    print()
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    print()
    for idx, mpc in enumerate(max_population_counts):
        if idx > 0:
            print()
            print("--------------------------------------------------")
            print()

        all_generations, elapsed_ga_algo_time = __run_ga_algo(
            max_gen_idx = max_gen_idx,
            max_population_count = mpc
        )
        multiple_runs_data[f"mpc_{mpc}"] = {
            "max_population_count": mpc,
            "all_generations": all_generations,
            "elapsed_ga_algo_time": elapsed_ga_algo_time,
        }
    print()
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    print()

    # Populate the local database with best population data
    populate_sessions_db(
        list(multiple_runs_data.values())[-1]["all_generations"][-1].populations[0]
        # Using [-1] indices, we are taking the last generation from the last run (with the highest population count in this case)
        # and with [0], we are taking the best population from that run
    )

    # Visualisation of the results of Genetic Algorithm
    print()
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    print()
    __visualize_ga_algo(multiple_runs_data)
    print()
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    print()

    # print(f"Graph data =")
    # print(json.dumps(graph_data, indent=4))
    return jsonify("ook"), 200


def fetch_timetable_ga():
    sessions = Session.query.all()
    actual_sessions_allocated = Session.query.count()
    venues = Venue.query.all()
    venue_index_map = {venue.id: index for index, venue in enumerate(venues)}
    timetable = [[None] * TOTAL_HOURS_IN_WEEK for _ in range(len(venues))]

    # Total sessions needed calculation
    total_sessions_needed = 0
    units = Unit.query.all()

    for unit in units:
        unit_sessions = UnitSession.query.filter_by(unit_id=unit.id).all()
        for us in unit_sessions:
            sessions_needed = math.ceil(unit.quota / us.capacity)
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
