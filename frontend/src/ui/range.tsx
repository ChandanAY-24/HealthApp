import React from 'react';
import { TimeRange } from '../pages/types';

interface RangeSelectorProps {
  activeRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({ activeRange, onChange }) => {
  const ranges: { id: TimeRange; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--bg-subtle)',
        padding: '3px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {ranges.map((r) => {
        const isActive = activeRange === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              color: isActive ? 'var(--ink-950)' : 'var(--ink-500)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
};
