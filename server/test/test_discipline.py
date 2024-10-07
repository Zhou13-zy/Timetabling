import pytest
from models.discipline import Discipline
import uuid

def test_get_disciplines(client, session):
    response = client.get('/v1/api/disciplines')
    data = response.get_json()

    assert response.status_code == 200
    assert data['message'] == "Data retrieved successfully"


