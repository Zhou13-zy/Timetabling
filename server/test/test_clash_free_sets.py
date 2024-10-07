import pytest
from models.clash_free_set import Clash_Free_Set
import uuid

@pytest.fixture
def test_cfs_get_route(client):
    response = client.get('/v1/api/clash-free-sets')

    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Data retrieved successfully'

@pytest.fixture
def test_cfs_cohort(session):
    cfs = Clash_Free_Set(
        ref_type="cohort",
        cohortId=str(uuid.uuid4()),  
        set="CNCO3002, CNCO5002, ISAD4000"
    )
    session.add(cfs)
    session.commit()  
    return cfs

@pytest.fixture
def test_cfs_staff(session):
    cfs = Clash_Free_Set(
        ref_type="staff",
        staffId=str(uuid.uuid4()),  
        set="CNCO3002, CNCO5002, ISAD4000"
    )
    session.add(cfs)
    session.commit()  
    return cfs

@pytest.fixture
def updated_cfs_data():
    return {
        'set': 'CNCO3003, CNCO5003, ISAD4001'
    }

@pytest.fixture
def test_update_cfs_route(client, test_cfs_cohort, updated_cfs_data):
    response = client.put(f'/v1/api/cfs/{test_cfs_cohort.id}', json=updated_cfs_data)
    
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}. Response: {response.get_json()}"
    data = response.get_json()
    assert data['message'] == 'Clash Free Set updated successfully'

@pytest.fixture
def test_update_cfs_route_for_staff(client, test_cfs_staff, updated_cfs_data):
    response = client.put(f'/v1/api/clash-free-sets/{test_cfs_staff.id}', json=updated_cfs_data)
    
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}. Response: {response.get_json()}"
    data = response.get_json()
    assert data['message'] == 'Clash Free Set updated successfully'
