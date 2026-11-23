import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { useActions } from '../actions';
import { Settings, ShieldCheck, Sun, Moon, RefreshCw, Smartphone } from '../ui/icons';
import { Button, Input } from '../ui/kit';

export const SettingsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const { notify } = useActions();

  const [name, setName] = useState(state.profile.name);
  const [bloodType, setBloodType] = useState(state.profile.bloodType);
  const [height, setHeight] = useState(String(state.profile.heightCm));
  const [weight, setWeight] = useState(String(state.profile.weightKg));

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const handleSaveProfile = () => {
    store.updateProfile({
      name,
      bloodType,
      heightCm: parseFloat(height) || 178,
      weightKg: parseFloat(weight) || 72,
    });
    notify('Profile updated successfully', false);
  };

  const handleToggleTheme = () => {
    const next = state.profile.theme === 'light' ? 'dark' : 'light';
    store.setTheme(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Settings</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Health profile, appearance theme, connected medical wearables, and data maintenance.
        </p>
      </div>

      {/* Appearance Theme */}
      <div className="settings-section">
        <h2 className="section-title">
          <Sun size={18} color="var(--lime-600)" />
          Appearance & Contrast
        </h2>
        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink-900)' }}>
              Theme (Ink & Lime)
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>
              Currently using {state.profile.theme.toUpperCase()} theme
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleToggleTheme}>
            {state.profile.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            Switch to {state.profile.theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="settings-section">
        <h2 className="section-title">
          <Settings size={18} color="var(--lime-600)" />
          Personal Health Profile
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Blood Type" value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
          <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="secondary" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="settings-section">
        <h2 className="section-title">
          <Smartphone size={18} color="var(--lime-600)" />
          Connected Health Devices
        </h2>
        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Apple Watch Ultra (Series 2)</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>Continuous HR, SpO2 & ECG Telemetry • Synced 4m ago</div>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--lime-600)', fontWeight: 700 }}>Connected</span>
        </div>
        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Withings BPM Connect</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>Wi-Fi Blood Pressure Cuff • Synced this morning</div>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--lime-600)', fontWeight: 700 }}>Connected</span>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="settings-section" style={{ borderColor: 'var(--color-danger)' }}>
        <h2 className="section-title" style={{ color: 'var(--color-danger)' }}>
          Reset Data
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>
          Restores original clinical sample data and resets all local storage records.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all sample data to default?')) {
                store.resetAllData();
                notify('Data reset to default', false);
              }
            }}
          >
            <RefreshCw size={14} /> Reset to Sample Data
          </Button>
        </div>
      </div>
    </div>
  );
};
