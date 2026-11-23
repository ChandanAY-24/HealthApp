from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from ..models.entities import AppointmentEntity
from ..schemas.schemas import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/care", tags=["Care"])

@router.get("/appointments", response_model=List[AppointmentResponse])
def get_appointments(db: Session = Depends(get_db)):
    return db.query(AppointmentEntity).order_by(AppointmentEntity.date.asc()).all()

@router.post("/appointments", response_model=AppointmentResponse)
def book_appointment(apt: AppointmentCreate, db: Session = Depends(get_db)):
    new_apt = AppointmentEntity(
        id=f"apt-{uuid.uuid4().hex[:8]}",
        status="Upcoming",
        **apt.dict()
    )
    db.add(new_apt)
    db.commit()
    db.refresh(new_apt)
    return new_apt

@router.patch("/appointments/{apt_id}/cancel")
def cancel_appointment(apt_id: str, db: Session = Depends(get_db)):
    apt = db.query(AppointmentEntity).filter(AppointmentEntity.id == apt_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    apt.status = "Cancelled"
    db.commit()
    return {"id": apt.id, "status": "Cancelled"}
