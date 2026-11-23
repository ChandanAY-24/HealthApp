import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Heart, Pill, Calendar, FileText, ArrowRight } from './ui/icons';
import { navigateTo, RoutePath } from './router';
import { store } from './store';

interface FinderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickFinder: React.FC<FinderProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const state = store.getState();

  // Search items across all pages and records
  interface SearchItem {
    id: string;
    title: string;
    category: string;
    icon: React.ReactNode;
    route: RoutePath;
  }

  const allItems: SearchItem[] = [
    { id: 'p-home', title: 'Home Overview Dashboard', category: 'Navigation', icon: <ArrowRight size={16} />, route: 'home' },
    { id: 'p-vitals', title: 'Heart Rate & Vitals Trends', category: 'Vitals', icon: <Heart size={16} />, route: 'vitals' },
    { id: 'p-meds', title: 'Medications & Refill Schedule', category: 'Medications', icon: <Pill size={16} />, route: 'meds' },
    { id: 'p-care', title: 'Care Team & Book Appointments', category: 'Care', icon: <Calendar size={16} />, route: 'care' },
    { id: 'p-records', title: 'Diagnostic Scans & Lab Results', category: 'Records', icon: <FileText size={16} />, route: 'records' },
    { id: 'p-reports', title: 'Clinical Reports & CSV Export', category: 'Reports', icon: <FileText size={16} />, route: 'reports' },
    { id: 'p-activity', title: 'Daily Activity & Fitness Rings', category: 'Fitness', icon: <ArrowRight size={16} />, route: 'activity' },
    { id: 'p-sleep', title: 'Sleep Hypnogram & Recovery', category: 'Sleep', icon: <ArrowRight size={16} />, route: 'sleep' },
    { id: 'p-food', title: 'Dietary Macros & Water Intake', category: 'Nutrition', icon: <ArrowRight size={16} />, route: 'food' },
    { id: 'p-settings', title: 'App Settings & Medical Units', category: 'Settings', icon: <ArrowRight size={16} />, route: 'settings' },
    { id: 'p-help', title: 'Emergency Contacts & Clinical Help', category: 'Help', icon: <ArrowRight size={16} />, route: 'help' },
  ];

  // Include dynamic records and meds matching query
  state.medications.forEach((m) => {
    allItems.push({
      id: `med-${m.id}`,
      title: `${m.name} (${m.dosage})`,
      category: 'Medication',
      icon: <Pill size={16} />,
      route: 'meds',
    });
  });

  state.labResults.forEach((l) => {
    allItems.push({
      id: `lab-${l.id}`,
      title: `${l.testName}: ${l.value} ${l.unit}`,
      category: 'Lab Result',
      icon: <FileText size={16} />,
      route: 'records',
    });
  });

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  const handleSelect = (item: SearchItem) => {
    navigateTo(item.route);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        zIndex: 99,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-strong)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '0.75rem',
          }}
        >
          <Search size={20} color="var(--ink-400)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, vital, medication, or record..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--ink-950)',
              outline: 'none',
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.6875rem',
              color: 'var(--ink-500)',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-400)', fontSize: '0.875rem' }}>
              No matches found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--bg-subtle)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        color: isSelected ? 'var(--lime-600)' : 'var(--ink-500)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink-900)' }}>
                      {item.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--ink-400)',
                      backgroundColor: 'var(--bg-primary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
