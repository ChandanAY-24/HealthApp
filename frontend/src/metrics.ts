// Clinical & Wellness Calculation Engine

export interface HeartRateZones {
  rest: number;
  fatBurnMin: number;
  fatBurnMax: number;
  cardioMin: number;
  cardioMax: number;
  peakMin: number;
}

export const calculateHeartRateZones = (age: number, restingHr: number): HeartRateZones => {
  const maxHr = 220 - age;
  const reserve = maxHr - restingHr;

  return {
    rest: restingHr,
    fatBurnMin: Math.round(restingHr + reserve * 0.5),
    fatBurnMax: Math.round(restingHr + reserve * 0.69),
    cardioMin: Math.round(restingHr + reserve * 0.7),
    cardioMax: Math.round(restingHr + reserve * 0.84),
    peakMin: Math.round(restingHr + reserve * 0.85),
  };
};

export const calculateDailySleepScore = (
  durationMin: number,
  deepPercent: number,
  remPercent: number,
  efficiencyPercent: number
): number => {
  // Target 8 hrs (480 mins)
  const durationScore = Math.min(100, (durationMin / 480) * 100) * 0.4;
  const stageScore = (Math.min(25, deepPercent) + Math.min(25, remPercent)) * 2 * 0.35;
  const efficiencyScore = efficiencyPercent * 0.25;

  return Math.min(100, Math.round(durationScore + stageScore + efficiencyScore));
};

export const calculateHydrationProgress = (currentGlasses: number, goalGlasses = 8): { percent: number; remainingGlasses: number } => {
  const percent = Math.min(100, Math.round((currentGlasses / goalGlasses) * 100));
  const remainingGlasses = Math.max(0, goalGlasses - currentGlasses);
  return { percent, remainingGlasses };
};
