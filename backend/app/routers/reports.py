from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import PlainTextResponse
from ..database import get_db
from ..models.entities import VitalEntity, MedicationEntity, AppointmentEntity
from ..schemas.schemas import HealthSummaryResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary", response_model=HealthSummaryResponse)
def get_health_summary(db: Session = Depends(get_db)):
    hr_readings = db.query(VitalEntity).filter(VitalEntity.type == "heart_rate").limit(30).all()
    ox_readings = db.query(VitalEntity).filter(VitalEntity.type == "oxygen").limit(30).all()
    bp_latest = db.query(VitalEntity).filter(VitalEntity.type == "blood_pressure").order_by(VitalEntity.date.desc()).first()
    med_count = db.query(MedicationEntity).count()
    apt_count = db.query(AppointmentEntity).filter(AppointmentEntity.status == "Upcoming").count()

    hr_avg = sum(r.avg for r in hr_readings) / len(hr_readings) if hr_readings else 72.0
    ox_avg = sum(r.avg for r in ox_readings) / len(ox_readings) if ox_readings else 98.0
    bp_str = f"{int(bp_latest.systolic)}/{int(bp_latest.diastolic)}" if bp_latest and bp_latest.systolic else "118/76"

    return HealthSummaryResponse(
        patient_name="Alex Rivera",
        resting_hr_avg=round(hr_avg, 1),
        oxygen_avg=round(ox_avg, 1),
        latest_bp=bp_str,
        sleep_score_avg=86.5,
        active_medications_count=med_count,
        upcoming_appointments_count=apt_count,
    )

@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db)):
    vitals = db.query(VitalEntity).order_by(VitalEntity.date.desc()).all()
    csv_lines = ["id,type,date,low,high,avg,unit"]
    for v in vitals:
        csv_lines.append(f"{v.id},{v.type},{v.date},{v.low},{v.high},{v.avg},{v.unit}")
    
    return PlainTextResponse(
        content="\n".join(csv_lines),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=halsa_export.csv"}
    )
