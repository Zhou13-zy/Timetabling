import pytest
import json
from models.venue import Venue

def test_venues_route(client):
    response = client.get('/v1/api/venues')
    assert response.status_code == 200
    data = response.get_json()  
    assert isinstance(data, dict)
    assert 'data' in data
    assert isinstance(data['data'], list)
    
    if len(data['data']) > 0:
        assert isinstance(data['data'][0], dict)  
        assert 'id' in data['data'][0]
        assert 'name' in data['data'][0]
        assert 'location' in data['data'][0]
        assert 'capacity' in data['data'][0]
        assert 'equipment_type' in data['data'][0]
        assert 'active' in data['data'][0]

@pytest.fixture
def test_update_venue_route(client, test_venue):
    updated_data = {
        'name': 'Updated Venue 2',
        'location': 'Updated Location',
        'capacity': 30,
        'equipment_type': 'computer',
        'active': False,
        'blocked_timeslots': '2024-08-31T09:00:00Z'
    }

    response = client.put(f'/v1/api/venue/{test_venue.id}', json=updated_data)
    
    assert response.status_code == 200
    data = response.get_json()
    
    # Verify the updated data
    response = client.get(f'/v1/api/venues/{test_venue.id}')
    data = response.get_json()
    
    assert response.status_code == 200
    assert data['data']['name'] == updated_data['name']
    assert data['data']['location'] == updated_data['location']
    assert data['data']['capacity'] == updated_data['capacity']
    assert data['data']['equipment_type'] == updated_data['equipment_type']
    assert data['data']['active'] == updated_data['active']
    assert data['data']['blocked_timeslots'] == updated_data['blocked_timeslots']