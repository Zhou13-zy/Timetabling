import pytest

def test_staff_info_route(client):
    response = client.get('/v1/api/staff')
    assert response.status_code == 200

    data = response.get_json()

    assert 'data' in data
    assert isinstance(data['data'], list)

