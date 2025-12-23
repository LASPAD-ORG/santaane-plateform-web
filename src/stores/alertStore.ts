import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface AlertState {
  alerts: Alert[];
  currentAlert: Alert | null;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => Promise<boolean>;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  currentAlert: null,

  /**
   * Show success alert
   */
  showSuccess: (title: string, message?: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      type: 'success',
      title,
      message,
      confirmText: 'OK',
    };

    set((state) => ({
      alerts: [...state.alerts, alert],
      currentAlert: state.currentAlert || alert,
    }));
  },

  /**
   * Show error alert
   */
  showError: (title: string, message?: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      type: 'error',
      title,
      message,
      confirmText: 'OK',
    };

    set((state) => ({
      alerts: [...state.alerts, alert],
      currentAlert: state.currentAlert || alert,
    }));
  },

  /**
   * Show warning alert
   */
  showWarning: (title: string, message?: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      type: 'warning',
      title,
      message,
      confirmText: 'OK',
    };

    set((state) => ({
      alerts: [...state.alerts, alert],
      currentAlert: state.currentAlert || alert,
    }));
  },

  /**
   * Show info alert
   */
  showInfo: (title: string, message?: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      type: 'info',
      title,
      message,
      confirmText: 'OK',
    };

    set((state) => ({
      alerts: [...state.alerts, alert],
      currentAlert: state.currentAlert || alert,
    }));
  },

  /**
   * Show confirmation dialog
   * Returns a promise that resolves to true if confirmed, false if cancelled
   */
  showConfirm: (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const alert: Alert = {
        id: Date.now().toString(),
        type: 'warning',
        title,
        message,
        onConfirm: () => {
          onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          onCancel?.();
          resolve(false);
        },
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
      };

      set((state) => ({
        alerts: [...state.alerts, alert],
        currentAlert: state.currentAlert || alert,
      }));
    });
  },

  /**
   * Close current alert and show next one in queue
   */
  closeAlert: () => {
    const { alerts, currentAlert } = get();

    if (!currentAlert) return;

    // Remove current alert from queue
    const newAlerts = alerts.filter((a) => a.id !== currentAlert.id);

    // Show next alert if any
    set({
      alerts: newAlerts,
      currentAlert: newAlerts[0] || null,
    });
  },
}));
