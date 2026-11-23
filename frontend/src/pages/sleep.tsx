import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { Moon, Clock, Activity, ShieldCheck } from '../ui/icons';
import { Badge } from '../ui/kit';

export const SleepPage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const latest = state.sleep[0] || {
    date: new Date().toISOString().split('T')[0],
    totalDurationMinutes: 465,
    efficiencyPercent: 92,
    score: 88,
    stages: [
      { stage: 'deep', durationMinutes: 102, percent: 22 },
      { stage: 'rem', durationMinutes: 112, percent: 24 },
      { stage: 'light', durationMinutes: 214, percent: 46 },
      { stage: 'awake', durationMinutes: 37, percent: 8 },
    ],
    bedtime: '23:15',
    wakeTime: '07:00',
    recoveryStatus: 'Optimal',
  };

  const hours = Math.floor(latest.totalDurationMinutes / 60);
  const minutes = latest.totalDurationMinutes % 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Sleep & Recovery</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Hypnogram stage tracking, sleep architecture, and restorative recovery.
        </p>
      </div>

      {/* Main Sleep Score Card */}
      <div className="card-section">
        <div className="section-title-row">
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--lime-600)', textTransform: 'uppercase' }}>
              Last Night's Sleep
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--ink-950)' }}>
              {hours}h {minutes}m
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--lime-600)' }}>
              {latest.score} / 100
            </div>
            <Badge variant="lime">Recovery: {latest.recoveryStatus}</Badge>
          </div>
        </div>

        {/* Hypnogram Stage Visualization */}
        <div className="hypnogram-container">
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: '0.5rem' }}>
            Sleep Stages Hypnogram
          </div>
          <div className="hypnogram-track" style={{ height: '36px' }}>
            {latest.stages.map((st, i) => (
              <div
                key={i}
                className={`stage-block stage-${st.stage}`}
                style={{ width: `${st.percent}%` }}
                title={`${st.stage.toUpperCase()}: ${st.durationMinutes}m (${st.percent}%)`}
              ></div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6' }}></span>
              <span>Deep: {latest.stages.find((s) => s.stage === 'deep')?.durationMinutes}m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#8b5cf6' }}></span>
              <span>REM: {latest.stages.find((s) => s.stage === 'rem')?.durationMinutes}m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#60a5fa' }}></span>
              <span>Light: {latest.stages.find((s) => s.stage === 'light')?.durationMinutes}m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b' }}></span>
              <span>Awake: {latest.stages.find((s) => s.stage === 'awake')?.durationMinutes}m</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>Bedtime</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{latest.bedtime}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>Wake Time</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{latest.wakeTime}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>Efficiency</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{latest.efficiencyPercent}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
