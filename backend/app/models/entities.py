from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from ..database import Base

class VitalEntity(Base):
    __tablename__ = "vitals"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, index=True)  # heart_rate, oxygen, blood_pressure, temperature
    timestamp = Column(String)
    date = Column(String, index=True)
    low = Column(Float)
    high = Column(Float)
    avg = Column(Float)
    unit = Column(String)
    systolic = Column(Float, nullable=True)
    diastolic = Column(Float, nullable=True)
    note = Column(String, nullable=True)

class MedicationEntity(Base):
    __tablename__ = "medications"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    dosage = Column(String)
    frequency = Column(String)
    time_slot = Column(String)
    stock = Column(Integer)
    refill_threshold = Column(Integer)
    refill_requested = Column(Boolean, default=False)
    history = Column(JSON, default=dict)

class ActivityEntity(Base):
    __tablename__ = "activity"

    id = Column(String, primary_key=True, index=True)
    date = Column(String, unique=True, index=True)
    move_calories = Column(Integer)
    move_goal = Column(Integer, default=650)
    exercise_minutes = Column(Integer)
    exercise_goal = Column(Integer, default=30)
    stand_hours = Column(Integer)
    stand_goal = Column(Integer, default=12)
    steps = Column(Integer)
    distance_km = Column(Float)

class SleepEntity(Base):
    __tablename__ = "sleep"

    id = Column(String, primary_key=True, index=True)
    date = Column(String, unique=True, index=True)
    total_duration_minutes = Column(Integer)
    efficiency_percent = Column(Integer)
    score = Column(Integer)
    stages = Column(JSON)
    bedtime = Column(String)
    wake_time = Column(String)
    recovery_status = Column(String)

class MealEntity(Base):
    __tablename__ = "meals"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    calories = Column(Integer)
    protein_grams = Column(Float)
    carbs_grams = Column(Float)
    fat_grams = Column(Float)
    iron_mg = Column(Float)
    meal_type = Column(String)
    date = Column(String, index=True)

class AppointmentEntity(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)
    provider_id = Column(String, index=True)
    provider_name = Column(String)
    specialty = Column(String)
    date = Column(String, index=True)
    time = Column(String)
    type = Column(String)
    status = Column(String, default="Upcoming")
    notes = Column(Text, nullable=True)

class LabResultEntity(Base):
    __tablename__ = "lab_results"

    id = Column(String, primary_key=True, index=True)
    test_name = Column(String)
    category = Column(String)
    value = Column(Float)
    unit = Column(String)
    ref_min = Column(Float)
    ref_max = Column(Float)
    status = Column(String)
    date = Column(String, index=True)
    doctor_notes = Column(Text, nullable=True)
