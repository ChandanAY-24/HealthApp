import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { useActions } from '../actions';
import { VitalType, VitalReading } from './types';
import { HighLowBarChart } from '../ui/charts';
import { RangeSelector } from '../ui/range';
import { Button, Modal, Input, Badge } from '../ui/kit';
import { Heart, Activity, Thermometer, Plus, Calendar } from '../ui/icons';
import { formatShortDate } from '../ui/format';

export const VitalsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const { notify } = useActions();
  const [activeMetric, setActiveMetric] = useState<VitalType>('heart_rate');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State for logging
  const [inputLow, setInputLow] = useState('60');
  const [inputHigh, setInputHigh] = useState('110');
  const [inputAvg, setInputAvg] = useState('75');

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const metrics: { id: VitalType; label: string; icon: React.ReactNode; unit: string }[] = [
    { id: 'heart_rate', label: 'Heart Rate', icon: <Heart size={16} />, unit: 'bpm' },
    { id: 'oxygen', label: 'Blood Oxygen (SpO2)', icon: <Activity size={16} />, unit: '%' },
    { id: 'blood_pressure', label: 'Blood Pressure', icon: <Activity size={16} />, unit: 'mmHg' },
    { id: 'temperature', label: 'Body Temperature', icon: <Thermometer size={16} />, unit: '°C' },
  ];

  const currentMetric = metrics.find((m) => m.id === activeMetric)!;
  const daysLimit = state.activeRange === '7d' ? 7 : state.activeRange === '30d' ? 30 : 90;
  const filteredReadings = state.vitals
    .filter((v) => v.type === activeMetric)
    .slice(0, daysLimit);

  const handleSaveVital = () => {
    const today = new Date().toISOString().split('T')[0];
    store.logVital(
      {
        type: activeMetric,
        date: today,
        timestamp: new Date().toISOString(),
        low: parseFloat(inputLow),
        high: parseFloat(inputHigh),
        avg: parseFloat(inputAvg),
        unit: currentMetric.unit,
      },
      notify
    );
    setIsLogModalOpen(false);
  };

  return (
    <div className="vitals-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Vitals</h1>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
            Comprehensive time-series telemetry and clinical ranges.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <RangeSelector activeRange={state.activeRange} onChange={(r) => store.setTimeRange(r)} />
          <Button variant="secondary" onClick={() => setIsLogModalOpen(true)}>
            <Plus size={16} /> Log Reading
          </Button>
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="vitals-subnav">
        {metrics.map((m) => (
          <button
            key={m.id}
            className={`subnav-btn ${activeMetric === m.id ? 'active' : ''}`}
            onClick={() => setActiveMetric(m.id)}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Interactive Range Chart Card */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-metric-info">
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--lime-600)', textTransform: 'uppercase' }}>
              {currentMetric.label} • {state.activeRange.toUpperCase()}
            </span>
            <div className="chart-summary-stat">
              <span className="chart-stat-number">{filteredReadings[0]?.avg || '--'}</span>
              <span className="chart-stat-range">{currentMetric.unit} latest</span>
            </div>
          </div>
          <Badge variant="lime">Clinical Target: Normal</Badge>
        </div>

        <HighLowBarChart readings={filteredReadings} unit={currentMetric.unit} metricLabel={currentMetric.label} />
      </div>

      {/* Reading History Table */}
      <div className="card-section">
        <div className="section-title-row">
          <h2 className="section-title">
            <Calendar size={18} color="var(--lime-600)" />
            Recent Logged Readings
          </h2>
        </div>
        <table className="vitals-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Low ({currentMetric.unit})</th>
              <th>High ({currentMetric.unit})</th>
              <th>Average</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReadings.slice(0, 10).map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{formatShortDate(r.date)}</td>
                <td style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>08:30 AM</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{r.low}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{r.high}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--ink-950)' }}>
                  {r.avg} {r.unit}
                </td>
                <td>
                  <Badge variant="lime">Normal</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Reading Modal */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title={`Log ${currentMetric.label}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label={`Low Value (${currentMetric.unit})`}
            type="number"
            value={inputLow}
            onChange={(e) => setInputLow(e.target.value)}
          />
          <Input
            label={`High Value (${currentMetric.unit})`}
            type="number"
            value={inputHigh}
            onChange={(e) => setInputHigh(e.target.value)}
          />
          <Input
            label={`Average / Spot Value (${currentMetric.unit})`}
            type="number"
            value={inputAvg}
            onChange={(e) => setInputAvg(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleSaveVital}>
              Save Reading
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
