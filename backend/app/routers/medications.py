from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.entities import MedicationEntity
from ..schemas.schemas import MedicationResponse, DoseToggleRequest

router = APIRouter(prefix="/medications", tags=["Medications"])

@router.get("", response_model=List[MedicationResponse])
def get_medications(db: Session = Depends(get_db)):
    return db.query(MedicationEntity).all()

@router.post("/{med_id}/toggle-dose")
def toggle_dose(med_id: str, req: DoseToggleRequest, db: Session = Depends(get_db)):
    med = db.query(MedicationEntity).filter(MedicationEntity.id == med_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")

    history = dict(med.history or {})
    curr = history.get(req.date, False)
    new_state = not curr
    history[req.date] = new_state
    med.history = history
    if new_state:
        med.stock = max(0, med.stock - 1)
    else:
        med.stock += 1

    db.commit()
    return {"id": med.id, "taken": new_state, "stock": med.stock}

@router.post("/{med_id}/request-refill")
def request_refill(med_id: str, db: Session = Depends(get_db)):
    med = db.query(MedicationEntity).filter(MedicationEntity.id == med_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")

    med.refill_requested = True
    db.commit()
    return {"id": med.id, "refill_requested": True}
