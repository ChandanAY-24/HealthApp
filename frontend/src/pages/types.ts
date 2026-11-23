// Domain Data Types for Halsa Personal Health Record

export type VitalType = 'heart_rate' | 'oxygen' | 'blood_pressure' | 'temperature' | 'respiratory_rate';

export type TimeRange = '7d' | '30d' | '90d';

export interface VitalReading {
  id: string;
  type: VitalType;
  timestamp: string; // ISO date
  date: string; // YYYY-MM-DD
  low: number;
  high: number;
  avg: number;
  unit: string;
  systolic?: number;
  diastolic?: number;
  note?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  stock: number;
  refillThreshold: number;
  refillRequested?: boolean;
  history: Record<string, boolean>; // date -> taken
}

export interface Workout {
  id: string;
  type: 'Running' | 'Cycling' | 'HIIT' | 'Yoga' | 'Swimming' | 'Walking';
  durationMinutes: number;
  caloriesBurned: number;
  date: string;
  heartRateAvg: number;
}

export interface ActivityDaily {
  date: string;
  moveCalories: number;
  moveGoal: number;
  exerciseMinutes: number;
  exerciseGoal: number;
  standHours: number;
  standGoal: number;
  steps: number;
  distanceKm: number;
}

export interface SleepStage {
  stage: 'deep' | 'light' | 'rem' | 'awake';
  durationMinutes: number;
  percent: number;
}

export interface SleepRecord {
  id: string;
  date: string;
  totalDurationMinutes: number;
  efficiencyPercent: number;
  score: number;
  stages: SleepStage[];
  bedtime: string;
  wakeTime: string;
  recoveryStatus: 'Optimal' | 'Good' | 'Fair' | 'Poor';
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  ironMg: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  date: string;
}

export interface NutritionDaily {
  date: string;
  waterGlasses: number; // 250ml each
  waterGoalGlasses: number;
  totalCalories: number;
  calorieGoal: number;
  meals: MealItem[];
}

export interface LabResult {
  id: string;
  testName: string;
  category: 'Metabolic' | 'Lipid Panel' | 'CBC' | 'Hormones' | 'Urinalysis';
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: 'normal' | 'low' | 'high';
  date: string;
  doctorNotes?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: 'Lab Result' | 'Scan' | 'Visit Summary' | 'Vaccine';
  date: string;
  provider: string;
  summary: string;
  documentUrl?: string;
  tags: string[];
}

export interface CareProvider {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  avatarUrl: string;
  availableDays: string[];
  slots: string[];
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'In-Person' | 'Video Call';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  providerId: string;
  sender: 'user' | 'provider';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  dob: string;
  bloodType: string;
  heightCm: number;
  weightKg: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}
