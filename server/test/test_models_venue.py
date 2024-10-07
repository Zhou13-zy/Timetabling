import pytest
from models.venue import Venue
from datetime import datetime, timedelta
import uuid

# Test data
test_venue_data = {
    'id': str(uuid.uuid4()),
    'name': 'Test',
    'location': 'Building 314:218',
    'capacity': 20,
    'equipment_type': 'projector',
    'active': True,
    'blocked_timeslots': '2024-08-25T08:00:00,2024-08-25T10:00:00',
    'timestamp': datetime.utcnow(),
}

@pytest.fixture
def new_venue():
    return Venue(
        id=test_venue_data['id'],
        name=test_venue_data['name'],
        location=test_venue_data['location'],
        capacity=test_venue_data['capacity'],
        equipment_type=test_venue_data['equipment_type'],
        active=test_venue_data['active'],
        blocked_timeslots=test_venue_data['blocked_timeslots'],
        timestamp=test_venue_data['timestamp'],
    )

def test_venue_creation(session, new_venue):
    session.add(new_venue)
    session.commit()

    # Retrieve the venue from the database
    retrieved_venue = session.get(Venue, new_venue.id)

    assert retrieved_venue.id == test_venue_data['id']
    assert retrieved_venue.name == test_venue_data['name']
    assert retrieved_venue.location == test_venue_data['location']
    assert retrieved_venue.capacity == test_venue_data['capacity']
    assert retrieved_venue.equipment_type == test_venue_data['equipment_type']
    assert retrieved_venue.active == test_venue_data['active']
    assert retrieved_venue.blocked_timeslots == test_venue_data['blocked_timeslots']
    
    # Check if the timestamp is within the last 3 minutes
    now = datetime.utcnow()
    assert retrieved_venue.timestamp <= now
    assert retrieved_venue.timestamp >= now - timedelta(minutes=3)

def test_venue_repr(new_venue):
    expected_repr = f"<Venue {new_venue.id}>"
    assert repr(new_venue) == expected_repr
