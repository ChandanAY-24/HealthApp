import {
  VitalReading,
  Medication,
  ActivityDaily,
  Workout,
  SleepRecord,
  NutritionDaily,
  MealItem,
  LabResult,
  MedicalRecord,
  CareProvider,
  Appointment,
  UserProfile,
  TimeRange,
} from './pages/types';

// Helper to generate dates relative to today
const getDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Realistic Seed Data
const initialProfile: UserProfile = {
  name: 'Alex Rivera',
  dob: '1992-06-14',
  bloodType: 'O+',
  heightCm: 178,
  weightKg: 72.5,
  emergencyContact: {
    name: 'Elena Rivera',
    relationship: 'Spouse',
    phone: '+1 (555) 234-5678',
  },
  units: 'metric',
  theme: 'light',
};

// Generate 90 days of heart rate, SpO2, blood pressure, temperature
const generateVitalsSeed = (): VitalReading[] => {
  const readings: VitalReading[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = getDateStr(i);
    // Heart rate
    const hrLow = Math.floor(54 + Math.sin(i * 0.2) * 6 + (Math.random() * 4));
    const hrHigh = Math.floor(118 + Math.cos(i * 0.25) * 12 + (Math.random() * 8));
    const hrAvg = Math.floor((hrLow + hrHigh) / 2);
    readings.push({
      id: `hr-${date}`,
      type: 'heart_rate',
      date,
      timestamp: `${date}T08:30:00Z`,
      low: hrLow,
      high: hrHigh,
      avg: hrAvg,
      unit: 'bpm',
    });

    // SpO2
    const oxLow = Math.floor(95 + (Math.random() * 2));
    const oxHigh = 99;
    readings.push({
      id: `ox-${date}`,
      type: 'oxygen',
      date,
      timestamp: `${date}T09:00:00Z`,
      low: oxLow,
      high: oxHigh,
      avg: 98,
      unit: '%',
    });

    // Blood Pressure
    const sys = Math.floor(116 + Math.sin(i * 0.1) * 8 + (Math.random() * 4));
    const dia = Math.floor(74 + Math.cos(i * 0.1) * 6 + (Math.random() * 3));
    readings.push({
      id: `bp-${date}`,
      type: 'blood_pressure',
      date,
      timestamp: `${date}T09:15:00Z`,
      low: dia,
      high: sys,
      avg: Math.floor((sys + dia) / 2),
      systolic: sys,
      diastolic: dia,
      unit: 'mmHg',
    });

    // Body Temperature
    const tempLow = 36.4 + (Math.random() * 0.2);
    const tempHigh = 36.9 + (Math.random() * 0.3);
    readings.push({
      id: `temp-${date}`,
      type: 'temperature',
      date,
      timestamp: `${date}T07:45:00Z`,
      low: Math.round(tempLow * 10) / 10,
      high: Math.round(tempHigh * 10) / 10,
      avg: Math.round(((tempLow + tempHigh) / 2) * 10) / 10,
      unit: '°C',
    });
  }
  return readings;
};

const initialMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin',
    dosage: '20 mg',
    frequency: 'Once daily',
    timeSlot: 'Evening',
    stock: 24,
    refillThreshold: 7,
    history: {
      [getDateStr(0)]: false,
      [getDateStr(1)]: true,
      [getDateStr(2)]: true,
      [getDateStr(3)]: true,
    },
  },
  {
    id: 'med-2',
    name: 'Omega-3 Fish Oil',
    dosage: '1000 mg',
    frequency: 'Twice daily',
    timeSlot: 'Morning',
    stock: 45,
    refillThreshold: 10,
    history: {
      [getDateStr(0)]: true,
      [getDateStr(1)]: true,
      [getDateStr(2)]: true,
    },
  },
  {
    id: 'med-3',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    timeSlot: 'Morning',
    stock: 6,
    refillThreshold: 10,
    refillRequested: false,
    history: {
      [getDateStr(0)]: true,
      [getDateStr(1)]: true,
      [getDateStr(2)]: false,
    },
  },
  {
    id: 'med-4',
    name: 'Magnesium Glycinate',
    dosage: '400 mg',
    frequency: 'Once nightly',
    timeSlot: 'Bedtime',
    stock: 32,
    refillThreshold: 8,
    history: {
      [getDateStr(0)]: false,
      [getDateStr(1)]: true,
    },
  },
];

const initialWorkouts: Workout[] = [
  {
    id: 'w-1',
    type: 'Running',
    durationMinutes: 42,
    caloriesBurned: 410,
    date: getDateStr(0),
    heartRateAvg: 146,
  },
  {
    id: 'w-2',
    type: 'HIIT',
    durationMinutes: 30,
    caloriesBurned: 290,
    date: getDateStr(1),
    heartRateAvg: 152,
  },
  {
    id: 'w-3',
    type: 'Cycling',
    durationMinutes: 55,
    caloriesBurned: 480,
    date: getDateStr(2),
    heartRateAvg: 138,
  },
  {
    id: 'w-4',
    type: 'Yoga',
    durationMinutes: 40,
    caloriesBurned: 160,
    date: getDateStr(4),
    heartRateAvg: 105,
  },
];

const initialActivity: ActivityDaily[] = Array.from({ length: 30 }, (_, i) => {
  const d = getDateStr(i);
  return {
    date: d,
    moveCalories: Math.floor(520 + Math.random() * 250),
    moveGoal: 650,
    exerciseMinutes: Math.floor(25 + Math.random() * 35),
    exerciseGoal: 30,
    standHours: Math.floor(10 + Math.random() * 4),
    standGoal: 12,
    steps: Math.floor(8200 + Math.random() * 4500),
    distanceKm: Math.round((6.2 + Math.random() * 3.5) * 10) / 10,
  };
});

const initialSleep: SleepRecord[] = Array.from({ length: 30 }, (_, i) => {
  const d = getDateStr(i);
  const totalMin = Math.floor(410 + (Math.random() * 90)); // ~7 to 8.3 hrs
  const deep = Math.floor(totalMin * 0.22);
  const rem = Math.floor(totalMin * 0.24);
  const awake = Math.floor(totalMin * 0.08);
  const light = totalMin - deep - rem - awake;
  const score = Math.min(96, Math.max(72, Math.floor(70 + (deep / 1.5) + (rem / 2))));

  return {
    id: `sl-${d}`,
    date: d,
    totalDurationMinutes: totalMin,
    efficiencyPercent: Math.floor(88 + Math.random() * 9),
    score,
    stages: [
      { stage: 'deep', durationMinutes: deep, percent: Math.round((deep / totalMin) * 100) },
      { stage: 'rem', durationMinutes: rem, percent: Math.round((rem / totalMin) * 100) },
      { stage: 'light', durationMinutes: light, percent: Math.round((light / totalMin) * 100) },
      { stage: 'awake', durationMinutes: awake, percent: Math.round((awake / totalMin) * 100) },
    ],
    bedtime: '23:15',
    wakeTime: '07:10',
    recoveryStatus: score >= 85 ? 'Optimal' : score >= 75 ? 'Good' : 'Fair',
  };
});

const initialMeals: MealItem[] = [
  {
    id: 'm-1',
    name: 'Steel Cut Oats with Blueberries & Chia',
    calories: 420,
    proteinGrams: 16,
    carbsGrams: 68,
    fatGrams: 9,
    ironMg: 3.4,
    mealType: 'Breakfast',
    date: getDateStr(0),
  },
  {
    id: 'm-2',
    name: 'Grilled Salmon with Quinoa & Steamed Spinach',
    calories: 650,
    proteinGrams: 46,
    carbsGrams: 42,
    fatGrams: 24,
    ironMg: 4.8,
    mealType: 'Lunch',
    date: getDateStr(0),
  },
  {
    id: 'm-3',
    name: 'Greek Yogurt with Walnuts & Honey',
    calories: 220,
    proteinGrams: 18,
    carbsGrams: 15,
    fatGrams: 8,
    ironMg: 0.9,
    mealType: 'Snack',
    date: getDateStr(0),
  },
];

const initialLabResults: LabResult[] = [
  {
    id: 'lab-1',
    testName: 'Total Cholesterol',
    category: 'Lipid Panel',
    value: 178,
    unit: 'mg/dL',
    refMin: 125,
    refMax: 200,
    status: 'normal',
    date: getDateStr(12),
    doctorNotes: 'Optimal range maintained with current regimen.',
  },
  {
    id: 'lab-2',
    testName: 'LDL Cholesterol',
    category: 'Lipid Panel',
    value: 92,
    unit: 'mg/dL',
    refMin: 50,
    refMax: 100,
    status: 'normal',
    date: getDateStr(12),
  },
  {
    id: 'lab-3',
    testName: 'HDL Cholesterol',
    category: 'Lipid Panel',
    value: 62,
    unit: 'mg/dL',
    refMin: 40,
    refMax: 80,
    status: 'normal',
    date: getDateStr(12),
  },
  {
    id: 'lab-4',
    testName: 'Fasting Blood Glucose',
    category: 'Metabolic',
    value: 91,
    unit: 'mg/dL',
    refMin: 70,
    refMax: 99,
    status: 'normal',
    date: getDateStr(12),
  },
  {
    id: 'lab-5',
    testName: 'Hemoglobin A1c',
    category: 'Metabolic',
    value: 5.3,
    unit: '%',
    refMin: 4.0,
    refMax: 5.6,
    status: 'normal',
    date: getDateStr(12),
  },
  {
    id: 'lab-6',
    testName: 'Serum Ferritin (Iron)',
    category: 'CBC',
    value: 145,
    unit: 'ng/mL',
    refMin: 30,
    refMax: 300,
    status: 'normal',
    date: getDateStr(12),
  },
  {
    id: 'lab-7',
    testName: 'High-Sensitivity CRP',
    category: 'Metabolic',
    value: 0.8,
    unit: 'mg/L',
    refMin: 0.0,
    refMax: 1.0,
    status: 'normal',
    date: getDateStr(12),
  },
];

const initialRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    title: 'Annual Comprehensive Metabolic Panel',
    category: 'Lab Result',
    date: getDateStr(12),
    provider: 'Quest Diagnostics / Dr. Marcus Vance',
    summary: 'Full blood chemistry within expected thresholds. Liver and kidney profiles optimal.',
    tags: ['Bloodwork', 'Metabolic', 'Annual'],
  },
  {
    id: 'rec-2',
    title: 'Thoracic & Cardiac Echocardiogram',
    category: 'Scan',
    date: getDateStr(45),
    provider: 'St. Jude Heart Institute',
    summary: 'Normal left ventricular ejection fraction (64%). No valvular regurgitation.',
    tags: ['Cardiology', 'Ultrasound'],
  },
  {
    id: 'rec-3',
    title: 'Annual Preventive Health Checkup',
    category: 'Visit Summary',
    date: getDateStr(14),
    provider: 'Dr. Marcus Vance (Primary Care)',
    summary: 'Blood pressure 118/76, clear lungs, normal heart tones. Recommended continuing current exercise program.',
    tags: ['PCP', 'Annual Physical'],
  },
  {
    id: 'rec-4',
    title: 'Seasonal Influenza Vaccine 2026',
    category: 'Vaccine',
    date: getDateStr(65),
    provider: 'Walgreens Health / Nurse Practitioner',
    summary: 'Quadrivalent flu shot administered left deltoid. No adverse reaction observed.',
    tags: ['Immunization', 'Influenza'],
  },
];

const initialProviders: CareProvider[] = [
  {
    id: 'prov-1',
    name: 'Dr. Marcus Vance, MD',
    specialty: 'Internal Medicine & Primary Care',
    clinic: 'Metro Health Pavilion, Suite 400',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Wed', 'Thu'],
    slots: ['09:30 AM', '11:00 AM', '02:15 PM', '04:00 PM'],
    phone: '+1 (555) 345-6789',
    email: 'm.vance@metrohealth.org',
  },
  {
    id: 'prov-2',
    name: 'Dr. Aris Thorne, MD, FACC',
    specialty: 'Cardiovascular Medicine',
    clinic: 'Heart & Rhythm Institute',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813579-a78b46a9a7b4?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Tue', 'Fri'],
    slots: ['10:00 AM', '01:30 PM', '03:30 PM'],
    phone: '+1 (555) 789-0123',
    email: 'a.thorne@heartrhythm.org',
  },
  {
    id: 'prov-3',
    name: 'Sarah Jenkins, MS, RD',
    specialty: 'Clinical Nutrition & Sports Dietetics',
    clinic: 'Vitality Wellness Collective',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    slots: ['08:30 AM', '10:30 AM', '01:00 PM', '05:00 PM'],
    phone: '+1 (555) 456-7890',
    email: 's.jenkins@vitalitywellness.com',
  },
];

const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    providerId: 'prov-1',
    providerName: 'Dr. Marcus Vance, MD',
    specialty: 'Internal Medicine & Primary Care',
    date: getDateStr(-6), // 6 days in future
    time: '11:00 AM',
    type: 'In-Person',
    status: 'Upcoming',
    notes: 'Routine 6-month wellness review and lipid panel check.',
  },
  {
    id: 'apt-2',
    providerId: 'prov-3',
    providerName: 'Sarah Jenkins, MS, RD',
    specialty: 'Clinical Nutrition',
    date: getDateStr(-18),
    time: '02:00 PM',
    type: 'Video Call',
    status: 'Upcoming',
    notes: 'Follow-up on iron intake and endurance training nutrition.',
  },
];

// Unified App State Interface
export interface AppState {
  profile: UserProfile;
  vitals: VitalReading[];
  medications: Medication[];
  workouts: Workout[];
  activity: ActivityDaily[];
  sleep: SleepRecord[];
  meals: MealItem[];
  waterGlassesToday: number;
  labResults: LabResult[];
  records: MedicalRecord[];
  providers: CareProvider[];
  appointments: Appointment[];
  activeRange: TimeRange;
}

// LocalStorage Persistence Key
const STORAGE_KEY = 'halsa_personal_health_record_v1';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getInitialState = (): AppState => {
  try {
    if (isBrowser) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }

  return {
    profile: initialProfile,
    vitals: generateVitalsSeed(),
    medications: initialMedications,
    workouts: initialWorkouts,
    activity: initialActivity,
    sleep: initialSleep,
    meals: initialMeals,
    waterGlassesToday: 6,
    labResults: initialLabResults,
    records: initialRecords,
    providers: initialProviders,
    appointments: initialAppointments,
    activeRange: '30d',
  };
};

class Store {
  private state: AppState = getInitialState();
  private listeners: Set<() => void> = new Set();
  // Action queue for reversible undo
  private undoStack: Array<{ label: string; revert: () => void }> = [];

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    try {
      if (isBrowser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('Error saving state:', e);
    }
    this.listeners.forEach((l) => l());
  }

  // State mutations with Undo support
  toggleMedicationDose(medId: string, date: string, notifyToast?: (label: string) => void) {
    const med = this.state.medications.find((m) => m.id === medId);
    if (!med) return;

    const previousState = !!med.history[date];
    const previousStock = med.stock;
    const newState = !previousState;
    const stockChange = newState ? -1 : 1;

    med.history = { ...med.history, [date]: newState };
    med.stock = Math.max(0, med.stock + stockChange);

    this.undoStack.push({
      label: `Toggled dose for ${med.name}`,
      revert: () => {
        med.history = { ...med.history, [date]: previousState };
        med.stock = previousStock;
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast(newState ? `Checked off ${med.name}` : `Unchecked ${med.name}`);
  }

  logWater(delta: number, notifyToast?: (label: string) => void) {
    const prev = this.state.waterGlassesToday;
    this.state.waterGlassesToday = Math.max(0, this.state.waterGlassesToday + delta);

    this.undoStack.push({
      label: 'Water logged',
      revert: () => {
        this.state.waterGlassesToday = prev;
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast(delta > 0 ? '+1 Glass of Water logged' : '-1 Glass of Water');
  }

  logVital(reading: Omit<VitalReading, 'id'>, notifyToast?: (label: string) => void) {
    const newReading: VitalReading = {
      ...reading,
      id: `vital-${Date.now()}`,
    };

    this.state.vitals = [newReading, ...this.state.vitals];

    this.undoStack.push({
      label: `Logged ${reading.type.replace('_', ' ')}`,
      revert: () => {
        this.state.vitals = this.state.vitals.filter((v) => v.id !== newReading.id);
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast(`Logged ${newReading.avg} ${newReading.unit}`);
  }

  bookAppointment(apt: Omit<Appointment, 'id'>, notifyToast?: (label: string) => void) {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
    };

    this.state.appointments = [newApt, ...this.state.appointments];

    this.undoStack.push({
      label: `Booked appointment with ${apt.providerName}`,
      revert: () => {
        this.state.appointments = this.state.appointments.filter((a) => a.id !== newApt.id);
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast(`Appointment confirmed for ${apt.date} at ${apt.time}`);
  }

  cancelAppointment(id: string, notifyToast?: (label: string) => void) {
    const apt = this.state.appointments.find((a) => a.id === id);
    if (!apt) return;

    const previousStatus = apt.status;
    apt.status = 'Cancelled';

    this.undoStack.push({
      label: `Cancelled appointment`,
      revert: () => {
        apt.status = previousStatus;
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast('Appointment cancelled');
  }

  requestMedRefill(medId: string, notifyToast?: (label: string) => void) {
    const med = this.state.medications.find((m) => m.id === medId);
    if (!med) return;

    med.refillRequested = true;

    this.undoStack.push({
      label: `Refill requested for ${med.name}`,
      revert: () => {
        med.refillRequested = false;
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast(`Refill requested for ${med.name}`);
  }

  logMeal(meal: Omit<MealItem, 'id'>, notifyToast?: (label: string) => void) {
    const newMeal: MealItem = {
      ...meal,
      id: `meal-${Date.now()}`,
    };

    this.state.meals = [newMeal, ...this.state.meals];

    this.undoStack.push({
      label: `Logged meal ${meal.name}`,
      revert: () => {
        this.state.meals = this.state.meals.filter((m) => m.id !== newMeal.id);
        this.notify();
      },
    });

    this.notify();
    if (notifyToast) notifyToast(`Logged ${meal.name} (${meal.calories} kcal)`);
  }

  setTimeRange(range: TimeRange) {
    this.state.activeRange = range;
    this.notify();
  }

  updateProfile(profile: Partial<UserProfile>) {
    this.state.profile = { ...this.state.profile, ...profile };
    this.notify();
  }

  setTheme(theme: 'light' | 'dark') {
    this.state.profile.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  undoLatest(): boolean {
    const action = this.undoStack.pop();
    if (action) {
      action.revert();
      return true;
    }
    return false;
  }

  resetAllData() {
    if (isBrowser) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Error clearing localStorage:', e);
      }
    }
    this.state = getInitialState();
    this.notify();
  }
}

export const store = new Store();
