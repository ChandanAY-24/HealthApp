import math
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.entities import (
    VitalEntity,
    MedicationEntity,
    ActivityEntity,
    SleepEntity,
    MealEntity,
    AppointmentEntity,
    LabResultEntity,
)

def seed_database(db: Session):
    # Check if database already has vitals
    if db.query(VitalEntity).first():
        return

    today = datetime.now()

    # 1. Seed 90 days of vitals
    for i in range(90, 0, -1):
        d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        # Heart rate
        hr_low = int(54 + math.sin(i * 0.2) * 6)
        hr_high = int(118 + math.cos(i * 0.25) * 12)
        hr_avg = int((hr_low + hr_high) / 2)
        db.add(VitalEntity(
            id=f"hr-{d}",
            type="heart_rate",
            timestamp=f"{d}T08:30:00Z",
            date=d,
            low=hr_low,
            high=hr_high,
            avg=hr_avg,
            unit="bpm"
        ))

        # Oxygen
        db.add(VitalEntity(
            id=f"ox-{d}",
            type="oxygen",
            timestamp=f"{d}T09:00:00Z",
            date=d,
            low=96,
            high=99,
            avg=98,
            unit="%"
        ))

        # Blood pressure
        sys = int(116 + math.sin(i * 0.1) * 8)
        dia = int(74 + math.cos(i * 0.1) * 6)
        db.add(VitalEntity(
            id=f"bp-{d}",
            type="blood_pressure",
            timestamp=f"{d}T09:15:00Z",
            date=d,
            low=dia,
            high=sys,
            avg=int((sys + dia) / 2),
            systolic=sys,
            diastolic=dia,
            unit="mmHg"
        ))

    # 2. Seed Medications
    meds = [
        MedicationEntity(
            id="med-1",
            name="Atorvastatin",
            dosage="20 mg",
            frequency="Once daily",
            time_slot="Evening",
            stock=24,
            refill_threshold=7,
            refill_requested=False,
            history={today.strftime("%Y-%m-%d"): True}
        ),
        MedicationEntity(
            id="med-2",
            name="Omega-3 Fish Oil",
            dosage="1000 mg",
            frequency="Twice daily",
            time_slot="Morning",
            stock=45,
            refill_threshold=10,
            refill_requested=False,
            history={today.strftime("%Y-%m-%d"): True}
        ),
        MedicationEntity(
            id="med-3",
            name="Vitamin D3",
            dosage="2000 IU",
            frequency="Once daily",
            time_slot="Morning",
            stock=6,
            refill_threshold=10,
            refill_requested=False,
            history={today.strftime("%Y-%m-%d"): False}
        )
    ]
    db.add_all(meds)

    # 3. Seed Appointments
    fut = (today + timedelta(days=6)).strftime("%Y-%m-%d")
    db.add(AppointmentEntity(
        id="apt-1",
        provider_id="prov-1",
        provider_name="Dr. Marcus Vance, MD",
        specialty="Internal Medicine & Primary Care",
        date=fut,
        time="11:00 AM",
        type="In-Person",
        status="Upcoming",
        notes="Routine 6-month wellness review and lipid panel check."
    ))

    # 4. Seed Lab results
    db.add_all([
        LabResultEntity(
            id="lab-1",
            test_name="Total Cholesterol",
            category="Lipid Panel",
            value=178,
            unit="mg/dL",
            ref_min=125,
            ref_max=200,
            status="normal",
            date=(today - timedelta(days=12)).strftime("%Y-%m-%d"),
            doctor_notes="Optimal range maintained with current regimen."
        ),
        LabResultEntity(
            id="lab-2",
            test_name="Fasting Blood Glucose",
            category="Metabolic",
            value=91,
            unit="mg/dL",
            ref_min=70,
            ref_max=99,
            status="normal",
            date=(today - timedelta(days=12)).strftime("%Y-%m-%d")
        )
    ])

    db.commit()
