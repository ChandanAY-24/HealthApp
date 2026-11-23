import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/store';

describe('HealthApp Store & Undo Queue', () => {
  beforeEach(() => {
    store.resetAllData();
  });

  it('initializes with seed vitals and medications', () => {
    const state = store.getState();
    expect(state.vitals.length).toBeGreaterThan(0);
    expect(state.medications.length).toBeGreaterThan(0);
    expect(state.profile.name).toBe('Alex Rivera');
  });

  it('toggles medication dose and allows reversible undo', () => {
    const medId = store.getState().medications[0].id;
    const today = new Date().toISOString().split('T')[0];
    const initialStock = store.getState().medications[0].stock;

    // Toggle dose
    store.toggleMedicationDose(medId, today);
    expect(store.getState().medications[0].history[today]).toBe(true);
    expect(store.getState().medications[0].stock).toBe(initialStock - 1);

    // Revert via Undo
    const undone = store.undoLatest();
    expect(undone).toBe(true);
    expect(store.getState().medications[0].history[today]).toBe(false);
    expect(store.getState().medications[0].stock).toBe(initialStock);
  });

  it('increments water glasses and reverts with undo', () => {
    const prev = store.getState().waterGlassesToday;
    store.logWater(1);
    expect(store.getState().waterGlassesToday).toBe(prev + 1);

    store.undoLatest();
    expect(store.getState().waterGlassesToday).toBe(prev);
  });

  it('logs a new vital and supports removal on undo', () => {
    const initialCount = store.getState().vitals.length;
    const today = new Date().toISOString().split('T')[0];

    store.logVital({
      type: 'heart_rate',
      date: today,
      timestamp: new Date().toISOString(),
      low: 62,
      high: 115,
      avg: 74,
      unit: 'bpm',
    });

    expect(store.getState().vitals.length).toBe(initialCount + 1);
    expect(store.getState().vitals[0].avg).toBe(74);

    store.undoLatest();
    expect(store.getState().vitals.length).toBe(initialCount);
  });
});
