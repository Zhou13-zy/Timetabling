import pytest
from models.cohort import Cohort
from datetime import datetime, date
import uuid


test_cohort_data = {
    'id': str(uuid.uuid4()),
    'name': '2025 Cohort',
    'startDate': date(2025, 1, 1),
    'endDate': date(2025, 12, 31),
    
}

@pytest.fixture
def new_cohort():
    return Cohort(
        id=test_cohort_data['id'],
        name=test_cohort_data['name'],
        startDate=test_cohort_data['startDate'],
        endDate=test_cohort_data['endDate'],    
    )

def test_cohort_creation(session, new_cohort):
    session.add(new_cohort)
    session.commit()
    assert new_cohort.id == test_cohort_data['id']
    assert new_cohort.name == test_cohort_data['name']
    assert new_cohort.startDate == test_cohort_data['startDate']
    assert new_cohort.endDate == test_cohort_data['endDate']
    
def test_cohort_dates(new_cohort):
    assert new_cohort.startDate < new_cohort.endDate

def test_cohort_repr(new_cohort):
    expected_repr = f"<Cohort {new_cohort.id}>"
    assert repr(new_cohort) == expected_repr
