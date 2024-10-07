import pytest
from models.discipline import Discipline
from models.faculty import Faculty  
from datetime import datetime
import uuid

# Sample data for the Faculty test
test_faculty_data = {
    'id': str(uuid.uuid4()),
    'name': 'Computer Science Faculty',
    'timestamp': datetime.utcnow(),
}

# Sample data for the Discipline test
test_discipline_data = {
    'id': str(uuid.uuid4()),
    'name': 'Computer Science',
    'facultyId': test_faculty_data['id'],  
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

def test_faculty_creation(session, new_faculty):
    retrieved_faculty = session.get(Faculty, new_faculty.id)

    # Ensure that the retrieved faculty matches what we created
    assert retrieved_faculty is not None  # Ensure the faculty is found
    assert retrieved_faculty.id == new_faculty.id
    assert retrieved_faculty.name == new_faculty.name

    # Check if the timestamp is valid
    assert retrieved_faculty.timestamp <= datetime.utcnow()

def test_discipline_creation(session, new_discipline):
    retrieved_discipline = session.get(Discipline, new_discipline.id)

    # Ensure that the retrieved discipline matches what we created
    assert retrieved_discipline is not None  # Ensure the discipline is found
    assert retrieved_discipline.id == new_discipline.id
    assert retrieved_discipline.name == new_discipline.name
    assert retrieved_discipline.facultyId == new_discipline.facultyId

    # Check if the timestamp is valid
    assert retrieved_discipline.timestamp <= datetime.utcnow()

def test_discipline_repr(new_discipline):
    expected_repr = f"<Discipline {new_discipline.id}>"
    assert repr(new_discipline) == expected_repr
