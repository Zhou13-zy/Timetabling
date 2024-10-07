import pytest
from models import db
from models.session import Session
from models.unit import Unit
from models.venue import Venue
from models.unitSession import UnitSession
from unittest.mock import patch

def test_get_imported_info_success(client):
    data = [
  [
    {
      "capacity": 100,
      "dayOfWeek": "monday",
      "durationHours": 2,
      "endTime": "10:00",
      "sessionType": "lecture",
      "staffId": "staff-006",
      "staffName": "Sie Teng Soh",
      "startTime": "08:00",
      "unitCode": "CNCO3002",
      "unitId": "unit-001",
      "unitsessionId": "us-001",
      "venueId": "venue-001",
      "venueLocation": "101.001",
      "venueName": "Foyers (when booked with Lecture Theatre)"
    }]]

    response = client.post('/v1/api/session_import', json=data)
    response_data = response.get_json()

    assert response.status_code == 200
    assert response_data['message'] == "Sessions imported successfully"
    
def test_get_imported_info_invalid_sessions(client):
    
    # Test invalid data
    data = [
        [{
            "unitId": 1,# Invalid Unit ID
            "venueId": 999,  # Invalid Venue ID
            "unitsessionId": 999,  # Invalid UnitSession ID
            "sessionType": "Lecture",
            "staffId": "staff_1",
            "capacity": 100,
            "dayOfWeek": "Monday",
            "startTime": "10:00",
            "endTime": "12:00"
        }]
    ]

    response = client.post('/v1/api/session_import', json=data)
    response_data = response.get_json()

    assert response.status_code == 207
    assert response_data['message'] == "Sessions imported with some errors"
    assert response_data['invalid_sessions'][0]['reason'] == "Unit ID 1 not found"
    
    data = [
        [{
            "unitId": "unit-001",
            "venueId": 999,  # Invalid Venue ID
            "unitsessionId": 999,  # Invalid UnitSession ID
            "sessionType": "Lecture",
            "staffId": "staff_1",
            "capacity": 100,
            "dayOfWeek": "Monday",
            "startTime": "10:00",
            "endTime": "12:00"
        }]
    ]

    response = client.post('/v1/api/session_import', json=data)
    response_data = response.get_json()

    assert response.status_code == 207
    assert response_data['message'] == "Sessions imported with some errors"
    assert response_data['invalid_sessions'][0]['reason'] == "Venue ID 999 not found"
    
    data = [
        [{
            "unitId": "unit-001",
            "venueId": "venue-001", 
            "unitsessionId": 999,  # Invalid UnitSession ID
            "sessionType": "Lecture",
            "staffId": "staff_1",
            "capacity": 100,
            "dayOfWeek": "Monday",
            "startTime": "10:00",
            "endTime": "12:00"
        }]
    ]

    response = client.post('/v1/api/session_import', json=data)
    response_data = response.get_json()

    assert response.status_code == 207
    assert response_data['message'] == "Sessions imported with some errors"
    assert response_data['invalid_sessions'][0]['reason'] == "Unit Session ID 999 not found"
    
def test_get_imported_info_missing_sessions(client):
    # session type ios nullable=False
    data = [
        [{
            "unitId": "unit-001",
            "venueId": "venue-001",  
            "unitsessionId": "us-001",  
            "staffId": "staff_1",
            "capacity": 100,
            "dayOfWeek": "Monday",
            "startTime": "10:00",
            "endTime": "12:00"
        }]
    ]

    response = client.post('/v1/api/session_import', json=data)
    response_data = response.get_json()
    assert response.status_code == 207
    assert response_data['message'] == "Sessions imported with some errors"
    assert response_data['invalid_sessions'][0]['reason'] == "Missing required fields"
    

def test_delete_session_data(client):

    response = client.delete('/v1/api/session_clear')
    response_data = response.get_json()

    assert response.status_code == 200
    assert response_data['message'] == "Sessions deleted successfully"
    

