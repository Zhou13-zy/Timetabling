import pytest
from models.faculty import Faculty
from datetime import datetime

test_faculty_data = {
    'name': 'Science and Engineering',    
}

@pytest.fixture
def new_faculty():
    return Faculty(
        name=test_faculty_data['name'],
    )

def test_faculty_creation(session, new_faculty):
    session.add(new_faculty)
    session.commit()
    
    assert new_faculty.name == test_faculty_data['name']
    

def test_faculty_repr(new_faculty):
    expected_repr = f"<Faculty {new_faculty.id}>"
    assert repr(new_faculty) == expected_repr
