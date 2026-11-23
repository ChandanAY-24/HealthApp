import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { FileText, Activity, ShieldCheck, Download } from '../ui/icons';
import { Badge, Button } from '../ui/kit';
import { formatShortDate } from '../ui/format';

export const RecordsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const [activeTab, setActiveTab] = useState<'labs' | 'scans' | 'visits' | 'vaccines'>('labs');

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Health Records</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Laboratory test reference bands, diagnostic scan reports, clinical summaries, and vaccines.
        </p>
      </div>

      {/* Subnav */}
      <div className="vitals-subnav">
        <button
          className={`subnav-btn ${activeTab === 'labs' ? 'active' : ''}`}
          onClick={() => setActiveTab('labs')}
        >
          Lab Results
        </button>
        <button
          className={`subnav-btn ${activeTab === 'scans' ? 'active' : ''}`}
          onClick={() => setActiveTab('scans')}
        >
          Scans & Imaging
        </button>
        <button
          className={`subnav-btn ${activeTab === 'visits' ? 'active' : ''}`}
          onClick={() => setActiveTab('visits')}
        >
          Doctor Visits
        </button>
        <button
          className={`subnav-btn ${activeTab === 'vaccines' ? 'active' : ''}`}
          onClick={() => setActiveTab('vaccines')}
        >
          Vaccinations
        </button>
      </div>

      {/* Lab Results with Clinical Reference Ranges */}
      {activeTab === 'labs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {state.labResults.map((lab) => {
            const min = lab.refMin;
            const max = lab.refMax;
            const totalSpan = max * 1.4 - min * 0.6;
            const markerPos = Math.min(100, Math.max(0, ((lab.value - min * 0.6) / totalSpan) * 100));

            return (
              <div key={lab.id} className="lab-result-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ink-950)' }}>
                      {lab.testName}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>
                      Category: {lab.category} • Tested {formatShortDate(lab.date)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      {lab.value} <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{lab.unit}</span>
                    </div>
                    <Badge variant={lab.status === 'normal' ? 'lime' : 'danger'}>
                      {lab.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Reference Range Slider Visualizer */}
                <div className="lab-range-meter">
                  <div className="lab-normal-band" style={{ left: '20%', right: '20%' }}></div>
                  <div className="lab-value-marker" style={{ left: `${markerPos}%` }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
                  <span>Low: &lt;{lab.refMin}</span>
                  <span style={{ color: 'var(--lime-600)', fontWeight: 700 }}>Normal Range: {lab.refMin}-{lab.refMax} {lab.unit}</span>
                  <span>High: &gt;{lab.refMax}</span>
                </div>

                {lab.doctorNotes && (
                  <div style={{ fontSize: '0.8125rem', backgroundColor: 'var(--bg-subtle)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', color: 'var(--ink-700)' }}>
                    <strong>Doctor note:</strong> {lab.doctorNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Scans, Visits, Vaccines list */}
      {activeTab !== 'labs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {state.records
            .filter((r) => {
              if (activeTab === 'scans') return r.category === 'Scan';
              if (activeTab === 'visits') return r.category === 'Visit Summary';
              return r.category === 'Vaccine';
            })
            .map((rec) => (
              <div key={rec.id} className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ink-950)' }}>
                    {rec.title}
                  </h3>
                  <Badge variant="neutral">{rec.category}</Badge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>
                  Provider: {rec.provider} • Date: {formatShortDate(rec.date)}
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-800)' }}>{rec.summary}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {rec.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        background: 'var(--bg-subtle)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--ink-600)',
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
