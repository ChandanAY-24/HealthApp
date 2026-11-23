from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from ..models.entities import VitalEntity
from ..schemas.schemas import VitalCreate, VitalResponse

router = APIRouter(prefix="/vitals", tags=["Vitals"])

@router.get("", response_model=List[VitalResponse])
def get_vitals(type: str = None, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(VitalEntity)
    if type:
        query = query.filter(VitalEntity.type == type)
    return query.order_by(VitalEntity.date.desc()).limit(limit).all()

@router.post("", response_model=VitalResponse)
def create_vital(vital: VitalCreate, db: Session = Depends(get_db)):
    new_vital = VitalEntity(
        id=f"vital-{uuid.uuid4().hex[:8]}",
        **vital.dict()
    )
    db.add(new_vital)
    db.commit()
    db.refresh(new_vital)
    return new_vital
