import pytest
from models.unitSession import UnitSession
from models.unit import Unit
from models.staff import Staff
from models.venue import Venue
from models.discipline import Discipline
from models.faculty import Faculty
from datetime import datetime, time
import uuid

# Sample data for the test
test_faculty_data = {
    'id': str(uuid.uuid4()),
    'name': 'Computer Science Faculty',
    'timestamp': datetime.utcnow(),
}

test_discipline_data = {
    'id': str(uuid.uuid4()),
    'name': 'Computer Science',
    'facultyId': test_faculty_data['id'],  
    'timestamp': datetime.utcnow(),
}

test_staff_data = {
    'id': str(uuid.uuid4()),
    'firstname': 'Jane',
    'lastname': 'Doe',
    'email': 'jane.doe@example.com',
    'disciplineId': test_discipline_data['id'],  
    'timestamp': datetime.utcnow(),
}

test_unit_data = {
    'id': str(uuid.uuid4()),
    'unitCode': 'COMP1234',
    'name': 'Introduction to Programming',
    'credit': 25,
    'quota': 100,
    'disciplineId': test_discipline_data['id'],  
    'staffId': test_staff_data['id'],
    'timestamp': datetime.utcnow(),
}

test_venue_data = {
    'id': str(uuid.uuid4()),
    'name': 'Lecture Hall 1',
    'location': 'Building A, Room 101',
    'capacity': 150,
    'equipment_type': 'projector',
    'active': True,
    'blocked_timeslots': '',
    'timestamp': datetime.utcnow(),
}

test_unit_session_data = {
    'id': str(uuid.uuid4()),
    'unit_id': test_unit_data['id'],
    'session_type': 'lecture',
    'duration_hours': 2,
    'capacity': 100,
    'equipment_type': 'projector',
    'timestamp': datetime.utcnow(),
}

@pytest.fixture
def new_faculty(session):
    faculty = Faculty(**test_faculty_data)
    session.add(faculty)
    session.commit()
    return faculty

@pytest.fixture
def new_discipline(session, new_faculty):
    discipline = Discipline(**test_discipline_data)
    session.add(discipline)
    session.commit()
    return discipline

@pytest.fixture
def new_staff(session, new_discipline):
    staff = Staff(**test_staff_data)
    session.add(staff)
    session.commit()
    return staff

@pytest.fixture
def new_unit(session, new_staff):
    unit = Unit(**test_unit_data)
    session.add(unit)
    session.commit()
    return unit

@pytest.fixture
def new_venue(session):
    venue = Venue(**test_venue_data)
    session.add(venue)
    session.commit()
    return venue

@pytest.fixture
def new_unit_session(session, new_unit):
    unit_session = UnitSession(**test_unit_session_data)
    session.add(unit_session)
    session.commit()
    return unit_session

def test_unit_session_creation(session, new_unit_session):
    retrieved_unit_session = session.get(UnitSession, new_unit_session.id)
    assert retrieved_unit_session is not None
    assert retrieved_unit_session.id == test_unit_session_data['id']
    assert retrieved_unit_session.unit_id == test_unit_session_data['unit_id']
    assert retrieved_unit_session.session_type == test_unit_session_data['session_type']
    assert retrieved_unit_session.duration_hours == test_unit_session_data['duration_hours']
    assert retrieved_unit_session.capacity == test_unit_session_data['capacity']
    assert retrieved_unit_session.equipment_type == test_unit_session_data['equipment_type']
