import React from 'react';
import { HelpCircle, AlertCircle, ShieldCheck, Heart, Pill, Activity } from '../ui/icons';

export const HelpPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Help & Clinical FAQ</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Information on reading health metrics, reference ranges, and emergency assistance.
        </p>
      </div>

      {/* Clinical Emergency Banner */}
      <div className="emergency-banner">
        <AlertCircle size={28} color="var(--color-danger)" />
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-danger)' }}>
            Immediate Medical Attention Notice
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--ink-800)' }}>
            If you are experiencing severe chest pain, shortness of breath, sudden numbness, or any life-threatening symptoms, immediately dial <strong>911 (US)</strong> or visit the nearest emergency facility.
          </div>
        </div>
      </div>

      {/* FAQ items */}
      <div>
        <div className="help-faq-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '0.5rem' }}>
            How do the High/Low vitals bars work?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-600)' }}>
            Each day's bar spans from that day's lowest recorded reading to its highest. The bright white dot inside the capsule indicates the daily average. When you click or tap on any day's bar, the top readout displays the exact numeric statistics for that date.
          </p>
        </div>

        <div className="help-faq-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '0.5rem' }}>
            How does the Undo action queue work?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-600)' }}>
            Ticking a dose off, logging a vital reading, adding water, or booking/cancelling an appointment updates the application state instantly and surfaces an Undo toast at the bottom right. Clicking "Undo" immediately rolls back the state and inventory change.
          </p>
        </div>

        <div className="help-faq-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '0.5rem' }}>
            How do I use the Quick Spotlight Search?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-600)' }}>
            Press <strong>Cmd + K</strong> (or <strong>Ctrl + K</strong> on Windows) anywhere in the application to bring up the Quick Finder. Type any vital, medication name, doctor, or test to jump straight to it.
          </p>
        </div>

        <div className="help-faq-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '0.5rem' }}>
            Where is my health data stored?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-600)' }}>
            All sample data is stored offline-first in your browser's private local storage. When running the FastAPI backend service, records and exports can be synchronized with the local SQLite database.
          </p>
        </div>
      </div>
    </div>
  );
};
