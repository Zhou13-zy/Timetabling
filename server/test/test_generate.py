import pytest
from models import db
from models.session import Session


def test_generate_route(client):
    response = client.post("/v1/api/generate-brute-force")
    data = response.get_json()
    assert response.status_code == 200
    assert data["total_sessions_needed"] == data["actual_sessions_allocated"]


def test_calculate_goodness_score_route(client):
    headers = {"Content-Type": "application/json"}
    response = client.post(
        "/v1/api/calculate-goodness-score",
        headers=headers,
        json={
            "weights": {"venue_optimization_weight": 0.5, "unit_conflict_weight": 0.5}
        },
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "goodness_score" in data
