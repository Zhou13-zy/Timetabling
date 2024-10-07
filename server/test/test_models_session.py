import pytest
from models.session import Session
from models.unit import Unit
from models.staff import Staff
from models.venue import Venue
from models.unitSession import UnitSession
from models.discipline import Discipline
from models.faculty import Faculty  
from datetime import datetime, time, timezone
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
    'location': 'Building 314:218',
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

test_session_data = {
    'id': str(uuid.uuid4()),
    'unitId': test_unit_data['id'],
    'staffId': test_staff_data['id'],
    'venueId': test_venue_data['id'],
    'unitsessionId': test_unit_session_data['id'],
    'type': 'lecture',
    'capacity': 100,
    'enrolledCount': 80,
    'dayOfTheWeek': 'monday',
    'startTime': time(9, 0),
    'endTime': time(11, 0),
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

@pytest.fixture
def new_session(session, new_unit, new_staff, new_venue, new_unit_session):
    session_data = test_session_data.copy()
    session_data['unitId'] = new_unit.id
    session_data['staffId'] = new_staff.id
    session_data['venueId'] = new_venue.id
    session_data['unitsessionId'] = new_unit_session.id
    session_instance = Session(**session_data)
    session.add(session_instance)
    session.commit()
    return session_instance

def test_session_creation(session, new_session):
    retrieved_session = session.get(Session, new_session.id)
    assert retrieved_session is not None
    assert retrieved_session.id == test_session_data['id']
    assert retrieved_session.unitId == test_session_data['unitId']
    assert retrieved_session.staffId == test_session_data['staffId']
    assert retrieved_session.venueId == test_session_data['venueId']
    assert retrieved_session.unitsessionId == test_session_data['unitsessionId']
    assert retrieved_session.type == test_session_data['type']
    assert retrieved_session.capacity == test_session_data['capacity']
    assert retrieved_session.enrolledCount == test_session_data['enrolledCount']
    assert retrieved_session.dayOfTheWeek == test_session_data['dayOfTheWeek']
    assert retrieved_session.startTime == test_session_data['startTime']
    assert retrieved_session.endTime == test_session_data['endTime']
