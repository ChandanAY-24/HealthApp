import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { FileText, Download, Printer, BarChart3 } from '../ui/icons';
import { Button, Badge } from '../ui/kit';
import { RangeSelector } from '../ui/range';
import { HighLowBarChart } from '../ui/charts';

export const ReportsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const daysLimit = state.activeRange === '7d' ? 7 : state.activeRange === '30d' ? 30 : 90;
  const hrReadings = state.vitals.filter((v) => v.type === 'heart_rate').slice(0, daysLimit);
  const oxReadings = state.vitals.filter((v) => v.type === 'oxygen').slice(0, daysLimit);
  const bpReadings = state.vitals.filter((v) => v.type === 'blood_pressure').slice(0, daysLimit);

  // Generate CSV download file from real state data
  const handleDownloadCsv = () => {
    let csv = 'Timestamp,Metric,Low,High,Average,Unit\n';
    state.vitals.slice(0, daysLimit).forEach((v) => {
      csv += `${v.timestamp},${v.type},${v.low},${v.high},${v.avg},${v.unit}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `halsa-health-export-${state.activeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="reports-toolbar">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Clinical Reports</h1>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
            Multi-metric aggregate report across 30 and 90 days. Export CSV or print for physician consultation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="no-print">
          <RangeSelector activeRange={state.activeRange} onChange={(r) => store.setTimeRange(r)} />
          <Button variant="outline" onClick={handleDownloadCsv}>
            <Download size={16} /> CSV Export
          </Button>
          <Button variant="secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Report
          </Button>
        </div>
      </div>

      {/* Clinical Summary Report Card */}
      <div className="card-section">
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-950)' }}>
            Patient Health Portfolio: {state.profile.name}
          </h2>
          <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', marginTop: '4px' }}>
            DOB: {state.profile.dob} • Blood Type: {state.profile.bloodType} • Evaluation Period: Last {state.activeRange.toUpperCase()}
          </div>
        </div>

        {/* Aggregate Heart Rate Chart */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Resting & Active Heart Rate ({state.activeRange.toUpperCase()})
          </h3>
          <HighLowBarChart readings={hrReadings} unit="bpm" metricLabel="Heart Rate" />
        </div>

        {/* Aggregate Blood Pressure */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Systolic & Diastolic Blood Pressure ({state.activeRange.toUpperCase()})
          </h3>
          <HighLowBarChart readings={bpReadings} unit="mmHg" metricLabel="Blood Pressure" />
        </div>

        {/* Aggregate Blood Oxygen */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Blood Oxygen Saturation (SpO2)
          </h3>
          <HighLowBarChart readings={oxReadings} unit="%" metricLabel="Oxygen" />
        </div>
      </div>
    </div>
  );
};
