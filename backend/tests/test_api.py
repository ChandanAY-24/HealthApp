import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.services.seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    yield

client = TestClient(app)

def test_root_and_health():
    resp = client.get("/")
    assert resp.status_code == 200
    assert "Halsa" in resp.json()["app"]

    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    assert health_resp.json()["status"] == "ok"

def test_get_vitals():
    resp = client.get("/api/vitals")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "avg" in data[0]

def test_get_medications_and_toggle():
    resp = client.get("/api/medications")
    assert resp.status_code == 200
    meds = resp.json()
    assert len(meds) > 0
    first_id = meds[0]["id"]

    # Toggle dose
    toggle_resp = client.post(f"/api/medications/{first_id}/toggle-dose", json={"date": "2026-11-23"})
    assert toggle_resp.status_code == 200
    assert "taken" in toggle_resp.json()

def test_reports_summary_and_csv():
    summary_resp = client.get("/api/reports/summary")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["patient_name"] == "Alex Rivera"

    csv_resp = client.get("/api/reports/export-csv")
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "heart_rate" in csv_resp.text
