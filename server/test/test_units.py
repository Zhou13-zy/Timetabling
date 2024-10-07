import pytest
from models.unit import Unit
import uuid


@pytest.fixture
def test_unit(session):
    unit_id = str(uuid.uuid4())
    unit = Unit(id=unit_id, unitCode="CS101", name="Introduction to Computer Science",
                credit=3, quota=30, disciplineId='discipline-001', staffId='staff-013')
    session.add(unit)
    session.commit()
    return unit

@pytest.fixture
def test_get_units(client, test_unit):
    response = client.get('/v1/api/units')
    data = response.get_json()

    assert response.status_code == 200
    assert data['message'] == "Data retrieved successfully"
    assert any(unit['id'] == str(test_unit.id) for unit in data['data'])


@pytest.fixture
def test_update_unit(client, test_unit):
    new_quota = 50
    response = client.put(
        f'/v1/api/unit/{test_unit.id}', json={'quota': new_quota})

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}. Response: {response.get_json()}"
    assert response.get_json()['message'] == "Unit updated successfully"

    # Fetch the updated unit to verify changes
    updated_response = client.get(f'/v1/api/unit/{test_unit.id}')
    updated_unit = updated_response.get_json()
    assert updated_unit['data'][
        'quota'] == new_quota, f"Expected quota {new_quota}, got {updated_unit['data']['quota']}"


@pytest.fixture
def test_update_nonexistent_unit(client):
    response = client.put('/v1/api/unit/999', json={'quota': 50})
    assert response.status_code == 404
    assert response.get_json()['message'] == "Unit not found"
