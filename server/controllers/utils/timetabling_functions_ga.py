from models.venue import Venue
from datetime import time
from models.generation import PopulationSession, Fitness, Population, Generation
import math
from models.clash_free_set import Clash_Free_Set
from models.session import Session
from models import db
from models.unit import Unit
from models.venue import Venue
from models.session import Session
from models.clash_free_set import Clash_Free_Set
from models.unitSession import UnitSession
import random
from typing import Any


DAY_START_HOUR = 8  # inclusive
DAY_END_HOUR = 21  # exclusive
DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday"]
TOTAL_HOURS_IN_DAY = DAY_END_HOUR - DAY_START_HOUR
TOTAL_HOURS_IN_WEEK = TOTAL_HOURS_IN_DAY * len(DAYS_OF_WEEK)

NUMBER_OF_ELITE_POPULATIONS = 1
TOURNAMENT_SELECTION_SIZE = 3


__filtered_unit_sessions: dict[str, list[UnitSession]] = dict()
clash_map: dict[tuple[str, str], bool] = dict()
units: list[Unit]
venues: list[Venue]

def __build_non_clashing_units() -> dict[str, list[str]]:
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


def get_unit_sessions(unit_id: str) -> list[UnitSession]:
    # Querying with an active session context
    unit_sessions = db.session.query(UnitSession).filter_by(unit_id=unit_id).order_by(UnitSession.capacity).all()

    return unit_sessions


def delete_existing_sessions() -> None:
    """Deletes all existing sessions in the database."""
    try:
        num_deleted = db.session.query(Session).delete()
        db.session.commit()
        print(f"Deleted {num_deleted} sessions.")
    except Exception as e:
        db.session.rollback()
        print(f"Failed to delete sessions: {e}")


def query_tables():
    global units, venues
    units = Unit.query.all()
    venues = Venue.query.filter_by(active=True).order_by(Venue.capacity).all()


def generate_clash_map():
    global clash_map
    non_clashing_units = __build_non_clashing_units()
    for i in range(len(units)):
        unit_i = units[i]
        clash_map[(unit_i.unitCode, unit_i.unitCode)] = False

        for k in range(i + 1, len(units)):
            unit_k = units[k]
            contains_1 = (unit_i.unitCode in non_clashing_units.get(unit_k.unitCode, []))
            contains_2 = (unit_k.unitCode in non_clashing_units.get(unit_i.unitCode, []))
            clash_map[(unit_i.unitCode, unit_k.unitCode)] = (contains_1 or contains_2)
            clash_map[(unit_k.unitCode, unit_i.unitCode)] = (contains_1 or contains_2)


def parse_blocked_timeslots(blocked_str) -> list[int]:
    """Parses the blocked timeslots string and returns a list of indices."""
    if not blocked_str:
        return []
    return [get_timeslot_index(*item.split("-")) for item in blocked_str.split(",")]


def print_generation_fitness(generation: Generation, gen_idx: int) -> None:
    # print(f"""Generation {gen_idx:>3}: fitness list = {', '.join([
    #     f'{round(x.fitness.score, 3):>6} ({x.fitness.total_conflict_count:>3} = {x.fitness.capacity_conflict_count:>3} + {x.fitness.equipments_conflict_count:>3} + {x.fitness.blocked_timeslot_conflict_count:>3} + {x.fitness.same_staff_conflict_count:>3} + {x.fitness.same_venue_conflict_count:>3} + {x.fitness.clashing_unit_conflict_count:>3})'
    #     for x in generation.populations[:1]
    # ])}""")
    print(f"""Generation {gen_idx:>3}: fitness list = {', '.join([
        f'{round(x.fitness.score, 2):>6} ({x.fitness.total_conflict_count:>3})'
        for x in generation.populations
    ])}""")


def calculate_sessions_needed(unit_quota: int, unit_session_capacity: int) -> int:
    return math.ceil(unit_quota / unit_session_capacity)


def get_timeslot_index(day, hour) -> int:
    return DAYS_OF_WEEK.index(day.lower()) * TOTAL_HOURS_IN_DAY + (int(hour) - DAY_START_HOUR)


def populate_sessions_db(population: Population):
    """Creates new session records in the database."""
    for item in population.sessions:
        day_of_week = DAYS_OF_WEEK[item.timeslot_idx // TOTAL_HOURS_IN_DAY]
        start_hour = DAY_START_HOUR + (item.timeslot_idx % TOTAL_HOURS_IN_DAY)
        end_hour = start_hour + item.unit_session.duration_hours
        start_time = time(start_hour, 0)
        end_time = time(end_hour, 0)

        new_session = Session(
            unitId=item.unit.id,
            staffId=item.staff_id,
            venueId=item.venue.id,
            unitsessionId=item.unit_session.id,
            type=item.unit_session.session_type,
            capacity=item.unit_session.capacity,
            dayOfTheWeek=day_of_week,
            startTime=start_time,
            endTime=end_time,
        )
        db.session.add(new_session)
        db.session.commit()


def assign_session_to_timetable(timetable, venue_index,
                                start_index, duration_hours, session_details):
    """Assigns session details to the timetable for the specified duration."""
    for i in range(duration_hours):
        timetable[venue_index][start_index + i] = session_details



class GeneticAlgorithm:

    def __init__(self, max_population_count: int, mutation_rate: float) -> None:
        self.max_population_count = max_population_count
        self.mutation_rate = mutation_rate


    def generate_single_population(self) -> Population:
        sessions: list[PopulationSession] = []

        for unit in units:
            filtered_unit_sessions = get_unit_sessions(unit.id)

            for us in filtered_unit_sessions:
                sessions_needed = calculate_sessions_needed(unit.quota, us.capacity)
                # accepted venues are those that have the capacity to have them ,, checking seesion and venue capacity in sorted order
                acceptable_venues = [v for v in venues if (v.capacity >= us.capacity)]

                for _ in range(sessions_needed):
                    day_idx: int = random.randrange(len(DAYS_OF_WEEK))
                    hour_idx: int = max(0, (random.randrange(TOTAL_HOURS_IN_DAY) - us.duration_hours + 1))
                    # randomly selecting from the accepted venues
                    venue: Venue = random.choice(acceptable_venues)

                    item = PopulationSession(
                        unit = unit,
                        unit_session = us,
                        venue = venue,
                        timeslot_idx = (day_idx * TOTAL_HOURS_IN_DAY) + hour_idx, #sorting
                        staff_id = unit.staffId if us.session_type == "lecture" else None
                    )
                    sessions.append(item)

        return Population(
            sessions = sessions,
            fitness = self.calculate_fitness(sessions),
        )


    def generate_single_generation(self) -> Generation:
        if not venues:
            print("No venues available in the database.")
            return Generation([])

        populations = [
            self.generate_single_population()
            for _ in range(self.max_population_count)
        ]
        generation = Generation(populations)

        return generation


    def calculate_fitness(self, sessions: list[PopulationSession]) -> Fitness:
        total_conflict_count = 0
        capacity_conflict_count = 0
        equipments_conflict_count = 0
        blocked_timeslot_conflict_count = 0
        same_staff_conflict_count = 0
        same_venue_conflict_count = 0
        clashing_unit_conflict_count = 0

        copied_sessions = [s for s in sessions]  # Shallow copy
        sessions = copied_sessions
        sessions.sort(key=lambda x: x.timeslot_idx)

        for s in sessions:
            s.hard_conflict_count = 0

        for i in range(len(sessions)):
            session_i = sessions[i]
            start_timeslot_i = session_i.timeslot_idx
            end_timeslot_i = start_timeslot_i + session_i.unit_session.duration_hours

            # Conflict type: Count of students in a Unit > Capacity of a venue
            if session_i.unit_session.capacity > session_i.venue.capacity:
                session_i.hard_conflict_count += 1
                capacity_conflict_count += 1
                total_conflict_count += 1

            # Conflict type: Session with need of special equipments assigned to rooms
            #                that don't have those equipments
            required_equipment_types_i = session_i.unit_session.get_equipment_types()
            venue_equipment_types_i = session_i.venue.get_equipment_types()
            if required_equipment_types_i:
                if not all(
                    equipment in venue_equipment_types_i
                    for equipment in required_equipment_types_i
                ):
                    session_i.hard_conflict_count += 1
                    equipments_conflict_count += 1
                    total_conflict_count += 1

            # Conflict type: Session assigned in blocked time slots
            venue_blocked_timeslots_i = parse_blocked_timeslots(session_i.venue.blocked_timeslots)
            if any(
                timeslot in venue_blocked_timeslots_i
                for timeslot in range(start_timeslot_i, end_timeslot_i)
            ):
                session_i.hard_conflict_count += 1
                blocked_timeslot_conflict_count += 1
                total_conflict_count += 1

            # Iterate over the sessions to check conflicts with other sessions
            for k in range(i + 1, len(sessions)):
                session_k = sessions[k]

                is_overlapping_timeslot = (session_k.timeslot_idx < end_timeslot_i)
                if not is_overlapping_timeslot:
                    # If not overlapping timeslot, break, as we sorted the populations based on timeslots
                    break

                unnatural_conflict = False

                # Conflict type: Same staff assigned to teach multiple sessions at the same time
                if (session_i.staff_id is not None) and (session_i.staff_id == session_k.staff_id):
                    session_i.hard_conflict_count += 1
                    session_k.hard_conflict_count += 1
                    same_staff_conflict_count += 1
                    total_conflict_count += 1

                # Conflict type: Same venue used for multiple sessions at the same time
                if session_i.venue.id == session_k.venue.id:
                    session_i.hard_conflict_count += 1
                    session_k.hard_conflict_count += 1
                    same_venue_conflict_count += 1
                    total_conflict_count += 1

                # Conflict type: Same student group assigned to multiple sessions at the same time
                if clash_map[(session_i.unit.unitCode, session_k.unit.unitCode)]:
                    session_i.hard_conflict_count += 1
                    session_k.hard_conflict_count += 1
                    clashing_unit_conflict_count += 1
                    total_conflict_count += 1

        return Fitness(
            score = (100 / (total_conflict_count + 1)), # + 1 in case conflict is 0
            total_conflict_count = total_conflict_count,
            capacity_conflict_count = capacity_conflict_count,
            equipments_conflict_count = equipments_conflict_count,
            blocked_timeslot_conflict_count = blocked_timeslot_conflict_count,
            same_staff_conflict_count = same_staff_conflict_count,
            same_venue_conflict_count = same_venue_conflict_count,
            clashing_unit_conflict_count = clashing_unit_conflict_count,
        )


    def sort_generation(self, generation: Generation) -> Generation:
        generation.populations.sort(key=lambda x: x.fitness.score, reverse=True)
        return generation


    def __select_tournament_generation(self, generation: Generation) -> Generation:
        tournament_generation = Generation([])
        tournament_generation.populations.extend(
            random.choices(generation.populations, k=TOURNAMENT_SELECTION_SIZE)
        )
        self.sort_generation(tournament_generation)
        return tournament_generation


    def __crossover_populations(
        self, population_1: Population, population_2: Population,
        calc_fitness: bool
    ) -> Population:
        crossovered_sessions: list[PopulationSession] = []
        total_sessions = min(len(population_1.sessions), len(population_2.sessions))

        for i in range(total_sessions):
            if random.random() >= 0.5:
                crossovered_sessions.append(population_1.sessions[i].copy_without_conflicts())
            else:
                crossovered_sessions.append(population_2.sessions[i].copy_without_conflicts())

        return Population(
            sessions = crossovered_sessions,
            fitness = self.calculate_fitness(crossovered_sessions) if calc_fitness else Fitness(),
        )


    def __crossover(self, generation: Generation, calc_fitness: bool = False) -> Generation:
        crossovered_generation = Generation([])

        for i in range(NUMBER_OF_ELITE_POPULATIONS):
            crossovered_generation.populations.append(generation.populations[i])

        for i in range(NUMBER_OF_ELITE_POPULATIONS, self.max_population_count):
            population_1 = self.__select_tournament_generation(generation).populations[0]
            population_2 = self.__select_tournament_generation(generation).populations[0]
            crossovered_generation.populations.append(
                self.__crossover_populations(population_1, population_2, calc_fitness)
            )

        return crossovered_generation


    # def __mutate_population(population: Population) -> None:
    #     new_population = self.generate_single_population()

    #     for i in range(len(population.sessions)):
    #         if random.random() < MUTATION_RATE:
    #             population.sessions[i] = new_population.sessions[i]

    #     population.fitness = self.calculate_fitness(population.sessions)


    def __mutate_population_only_conflicts(self, population: Population) -> None:
        sessions = population.sessions
        copied_sessions = [s for s in sessions]  # Shallow copy
        sessions = copied_sessions
        sessions.sort(key=lambda x: x.timeslot_idx)

        # venue capacity checking
        for i in range(len(sessions)):
            if random.random() > self.mutation_rate:
                continue

            session_i = sessions[i]
            start_timeslot_i = session_i.timeslot_idx
            end_timeslot_i = start_timeslot_i + session_i.unit_session.duration_hours

            has_conflict = False # conflict checking flag

            # Conflict type: Session with need of special equipments assigned to rooms
            #                that don't have those equipments
            required_equipment_types_i = session_i.unit_session.get_equipment_types()
            venue_equipment_types_i = session_i.venue.get_equipment_types()
            if required_equipment_types_i:
                if not all(
                    equipment in venue_equipment_types_i
                    for equipment in required_equipment_types_i
                ):
                    has_conflict = True

            # Conflict type: Session assigned in blocked time slots
            venue_blocked_timeslots_i = parse_blocked_timeslots(session_i.venue.blocked_timeslots)
            if any(
                timeslot in venue_blocked_timeslots_i
                for timeslot in range(start_timeslot_i, end_timeslot_i)
            ):
                has_conflict = True

            if has_conflict:  # check conflict and select randomly
                acceptable_venues = [v for v in venues if (v.capacity >= session_i.unit_session.capacity)]
                session_i.venue = random.choice(acceptable_venues)

                day_idx: int = random.randrange(len(DAYS_OF_WEEK))
                hour_idx: int = max(0, (random.randrange(TOTAL_HOURS_IN_DAY) - session_i.unit_session.duration_hours + 1))
                session_i.timeslot_idx = (day_idx * TOTAL_HOURS_IN_DAY) + hour_idx

            start_timeslot_i = session_i.timeslot_idx
            end_timeslot_i = start_timeslot_i + session_i.unit_session.duration_hours

            # Iterate over the sessions to check conflicts with other sessions
            # for session timeslot checking
            for k in range(i + 1, len(sessions)):
                session_k = sessions[k]
                has_conflict = False

                is_overlapping_timeslot = (session_k.timeslot_idx < end_timeslot_i)
                if not is_overlapping_timeslot:
                    # If not overlapping timeslot, break, as we sorted the populations based on timeslots
                    break

                # Conflict type: Same staff assigned to teach multiple sessions at the same time
                if (session_i.staff_id is not None) and (session_i.staff_id == session_k.staff_id):
                    has_conflict = True

                # Conflict type: Same venue used for multiple sessions at the same time
                if session_i.venue.id == session_k.venue.id:
                    has_conflict = True

                # Conflict type: Same student group assigned to multiple sessions at the same time
                if clash_map[(session_i.unit.unitCode, session_k.unit.unitCode)]:
                    has_conflict = True

                # random time and venue set
                if has_conflict:
                    acceptable_venues = [v for v in venues if (v.capacity >= session_k.unit_session.capacity)]
                    session_k.venue = random.choice(acceptable_venues)

                    day_idx: int = random.randrange(len(DAYS_OF_WEEK))
                    hour_idx: int = max(0, (random.randrange(TOTAL_HOURS_IN_DAY) - session_k.unit_session.duration_hours + 1))
                    session_k.timeslot_idx = (day_idx * TOTAL_HOURS_IN_DAY) + hour_idx

        population.fitness = self.calculate_fitness(population.sessions)


    def __mutate(self, generation: Generation) -> Generation:
        for i in range(NUMBER_OF_ELITE_POPULATIONS, self.max_population_count):
            self.__mutate_population_only_conflicts(generation.populations[i])
        return generation


    def evolve(self, generation: Generation) -> Generation:
        return self.__mutate(self.__crossover(generation))
