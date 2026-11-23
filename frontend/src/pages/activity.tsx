import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { ActivityRings } from '../ui/charts';
import { Button, Badge } from '../ui/kit';
import { Flame, Activity, Clock, Plus } from '../ui/icons';

export const ActivityPage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const today = state.activity[0] || {
    moveCalories: 580,
    moveGoal: 650,
    exerciseMinutes: 28,
    exerciseGoal: 30,
    standHours: 11,
    standGoal: 12,
    steps: 9420,
    distanceKm: 7.2,
  };

  const movePct = Math.round((today.moveCalories / today.moveGoal) * 100);
  const exercisePct = Math.round((today.exerciseMinutes / today.exerciseGoal) * 100);
  const standPct = Math.round((today.standHours / today.standGoal) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Activity</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Daily rings, active caloric expenditure, and workout logs.
        </p>
      </div>

      {/* Ring Meter Hero Card */}
      <div className="card-section" style={{ alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ink-900)' }}>Daily Rings</h2>
        <ActivityRings movePercent={movePct} exercisePercent={exercisePct} standPercent={standPct} />

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444' }}></span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Move: {today.moveCalories}/{today.moveGoal} kcal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--lime-500)' }}></span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Exercise: {today.exerciseMinutes}/{today.exerciseGoal} min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#0284c7' }}></span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Stand: {today.standHours}/{today.standGoal} hrs</span>
          </div>
        </div>
      </div>

      {/* Workouts History */}
      <div className="card-section">
        <div className="section-title-row">
          <h2 className="section-title">
            <Flame size={18} color="var(--lime-600)" />
            Recent Workouts
          </h2>
          <Button variant="secondary" size="sm">
            <Plus size={14} /> Add Workout
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {state.workouts.map((w) => (
            <div key={w.id} className="workout-item">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink-900)' }}>
                  {w.type}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>
                  {w.date} • Avg HR: {w.heartRateAvg} bpm
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.875rem' }}>
                  {w.durationMinutes} mins
                </span>
                <Badge variant="lime">{w.caloriesBurned} kcal</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
