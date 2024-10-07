from models.unit import Unit
from models.unitSession import UnitSession
from models.venue import Venue
from typing import Any
class PopulationSession:

    def __init__(self,
                 unit: Unit, unit_session: UnitSession,
                 venue: Venue, timeslot_idx: int, staff_id: str | None):
        self.unit = unit
        self.unit_session = unit_session
        self.venue = venue
        self.timeslot_idx = timeslot_idx
        self.staff_id = staff_id
        self.hard_conflict_count = 0

    def copy_without_conflicts(self):
        return PopulationSession(
            unit = self.unit,
            unit_session = self.unit_session,
            venue = self.venue,
            timeslot_idx = self.timeslot_idx,
            staff_id = self.staff_id,
        )
class Fitness:

    def __init__(self,
                 score: float = 0,
                 total_conflict_count: int = 0,
                 capacity_conflict_count: int = 0,
                 equipments_conflict_count: int = 0,
                 blocked_timeslot_conflict_count: int = 0,
                 same_staff_conflict_count: int = 0,
                 same_venue_conflict_count: int = 0,
                 clashing_unit_conflict_count: int = 0):
        self.score = score
        self.total_conflict_count = total_conflict_count

        self.capacity_conflict_count = capacity_conflict_count
        self.equipments_conflict_count = equipments_conflict_count
        self.blocked_timeslot_conflict_count = blocked_timeslot_conflict_count
        self.same_staff_conflict_count = same_staff_conflict_count
        self.same_venue_conflict_count = same_venue_conflict_count
        self.clashing_unit_conflict_count = clashing_unit_conflict_count

class Population:
    # Population means a timetable for this project that contains the sessions

    def __init__(self,
                 sessions: list[PopulationSession],
                 fitness: Fitness):
        self.sessions = sessions
        self.fitness = fitness


class Generation:
    # Generation is a collection of timetables/populations that represent a single generation

    def __init__(self, populations: list[Population]):
        self.populations = populations
