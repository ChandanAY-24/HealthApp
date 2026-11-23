import React from 'react';
import { useActions } from '../actions';
import { Check, Undo2, X } from './icons';

export const ToastUndoQueue: React.FC = () => {
  const { toast, undo, dismissToast } = useActions();

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        backgroundColor: 'var(--ink-950)',
        color: '#ffffff',
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '420px',
        border: '1px solid var(--border-strong)',
        animation: 'slideUp 0.25s ease-out',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--lime-500)',
          color: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Check size={14} strokeWidth={3} />
      </div>

      <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{toast.message}</span>

      {toast.undoable && (
        <button
          onClick={undo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--lime-500)',
            color: '#020617',
            padding: '4px 10px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity var(--transition-fast)',
          }}
        >
          <Undo2 size={13} />
          Undo
        </button>
      )}

      <button
        onClick={dismissToast}
        style={{
          color: 'var(--ink-400)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
};
