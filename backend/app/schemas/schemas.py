from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class VitalCreate(BaseModel):
    type: str
    date: str
    timestamp: str
    low: float
    high: float
    avg: float
    unit: str
    systolic: Optional[float] = None
    diastolic: Optional[float] = None
    note: Optional[str] = None

class VitalResponse(VitalCreate):
    id: str
    model_config = ConfigDict(from_attributes=True)

class MedicationCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    time_slot: str
    stock: int
    refill_threshold: int

class MedicationResponse(MedicationCreate):
    id: str
    refill_requested: bool
    history: Dict[str, bool]
    model_config = ConfigDict(from_attributes=True)

class DoseToggleRequest(BaseModel):
    date: str

class MealCreate(BaseModel):
    name: str
    calories: int
    protein_grams: float
    carbs_grams: float
    fat_grams: float
    iron_mg: float
    meal_type: str
    date: str

class MealResponse(MealCreate):
    id: str
    model_config = ConfigDict(from_attributes=True)

class AppointmentCreate(BaseModel):
    provider_id: str
    provider_name: str
    specialty: str
    date: str
    time: str
    type: str
    notes: Optional[str] = None

class AppointmentResponse(AppointmentCreate):
    id: str
    status: str
    model_config = ConfigDict(from_attributes=True)

class LabResultResponse(BaseModel):
    id: str
    test_name: str
    category: str
    value: float
    unit: str
    ref_min: float
    ref_max: float
    status: str
    date: str
    doctor_notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class HealthSummaryResponse(BaseModel):
    patient_name: str
    resting_hr_avg: float
    oxygen_avg: float
    latest_bp: str
    sleep_score_avg: float
    active_medications_count: int
    upcoming_appointments_count: int
