import React, { createContext, useContext, useState, ReactNode } from 'react';
import { store } from './store';

export interface ToastAction {
  id: string;
  message: string;
  undoable: boolean;
  onUndo?: () => void;
}

interface ActionContextType {
  toast: ToastAction | null;
  notify: (message: string, undoable?: boolean) => void;
  undo: () => void;
  dismissToast: () => void;
}

const ActionContext = createContext<ActionContextType | null>(null);

export const ActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastAction | null>(null);

  const notify = (message: string, undoable = true) => {
    const id = `toast-${Date.now()}`;
    setToast({
      id,
      message,
      undoable,
      onUndo: undoable ? () => store.undoLatest() : undefined,
    });

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 6000);
  };

  const undo = () => {
    if (toast?.onUndo) {
      toast.onUndo();
    } else {
      store.undoLatest();
    }
    setToast(null);
  };

  const dismissToast = () => {
    setToast(null);
  };

  return (
    <ActionContext.Provider value={{ toast, notify, undo, dismissToast }}>
      {children}
    </ActionContext.Provider>
  );
};

export const useActions = (): ActionContextType => {
  const ctx = useContext(ActionContext);
  if (!ctx) {
    throw new Error('useActions must be used within ActionProvider');
  }
  return ctx;
};
