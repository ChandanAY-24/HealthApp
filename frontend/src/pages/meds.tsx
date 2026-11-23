import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { useActions } from '../actions';
import { Pill, Check, Clock, AlertCircle, RefreshCw } from '../ui/icons';
import { Button, Badge } from '../ui/kit';

export const MedsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const { notify } = useActions();
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  // 4-week calendar dates (last 28 days)
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Medications</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Daily doses, inventory stock tracking, and 4-week adherence timeline.
        </p>
      </div>

      {/* Medication List Cards */}
      <div className="meds-timeline">
        {state.medications.map((med) => {
          const isTakenToday = !!med.history[todayStr];
          const isLowStock = med.stock <= med.refillThreshold;

          return (
            <div key={med.id} className={`med-card ${isTakenToday ? 'taken' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <button
                  onClick={() => store.toggleMedicationDose(med.id, todayStr, notify)}
                  className={`dose-check-btn ${isTakenToday ? 'checked' : ''}`}
                  title={isTakenToday ? 'Mark dose as untaken' : 'Mark dose as taken'}
                >
                  {isTakenToday && <Check size={16} strokeWidth={3} />}
                </button>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ink-950)' }}>
                      {med.name}
                    </h3>
                    <Badge variant={isTakenToday ? 'lime' : 'neutral'}>
                      {isTakenToday ? 'Taken Today' : 'Scheduled'}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', marginTop: '2px' }}>
                    {med.dosage} • {med.frequency} • {med.timeSlot}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {med.stock} pills remaining
                  </div>
                  {isLowStock && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                      Low Stock Alert
                    </div>
                  )}
                </div>

                {isLowStock && (
                  <Button
                    size="sm"
                    variant={med.refillRequested ? 'outline' : 'secondary'}
                    disabled={med.refillRequested}
                    onClick={() => store.requestMedRefill(med.id, notify)}
                  >
                    <RefreshCw size={13} />
                    {med.refillRequested ? 'Refill Ordered' : 'Order Refill'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4-Week Adherence Grid */}
      <div className="card-section">
        <h2 className="section-title">
          <Pill size={18} color="var(--lime-600)" />
          4-Week Adherence Timeline
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', marginTop: '-0.5rem' }}>
          Green blocks indicate 100% adherence to all prescribed doses for that day.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', margin: '1rem 0' }}>
          {calendarDays.map((d) => {
            const allTaken = state.medications.every((m) => !!m.history[d]);
            const isToday = d === todayStr;

            return (
              <div
                key={d}
                style={{
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: allTaken ? 'var(--lime-500)' : 'var(--bg-subtle)',
                  border: isToday ? '2px solid var(--ink-950)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: allTaken ? '#020617' : 'var(--ink-500)',
                  fontFamily: 'var(--font-mono)',
                }}
                title={`${d}: ${allTaken ? 'All doses taken' : 'Missed or incomplete'}`}
              >
                {d.split('-')[2]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
