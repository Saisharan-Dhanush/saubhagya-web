import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  system?: string;
  acknowledged?: boolean;
  persistent?: boolean;
  autoDismiss?: number; // seconds
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (message: string, type?: Alert['type'], options?: Partial<Alert>) => void;
  removeAlert: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  clearAllAlerts: () => void;
  getActiveAlerts: () => Alert[];
  getCriticalAlerts: () => Alert[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: React.ReactNode;
  maxAlerts?: number;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({
  children,
  maxAlerts = 100
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((
    message: string,
    type: Alert['type'] = 'info',
    options: Partial<Alert> = {}
  ) => {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: options.title || type.charAt(0).toUpperCase() + type.slice(1),
      message,
      timestamp: new Date(),
      acknowledged: false,
      persistent: type === 'critical' || options.persistent,
      autoDismiss: options.autoDismiss || (type === 'info' ? 5 : type === 'success' ? 3 : undefined),
      ...options,
    };

    setAlerts(prev => {
      const newAlerts = [alert, ...prev];

      // Remove oldest alerts if we exceed maxAlerts
      if (newAlerts.length > maxAlerts) {
        return newAlerts.slice(0, maxAlerts);
      }

      return newAlerts;
    });

    // Auto-dismiss if specified
    if (alert.autoDismiss && !alert.persistent) {
      setTimeout(() => {
        removeAlert(alert.id);
      }, alert.autoDismiss * 1000);
    }

    return alert.id;
  }, [maxAlerts]);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const getActiveAlerts = useCallback(() => {
    return alerts.filter(alert => !alert.acknowledged);
  }, [alerts]);

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(alert => alert.type === 'critical' && !alert.acknowledged);
  }, [alerts]);

  const value: AlertContextType = {
    alerts,
    addAlert,
    removeAlert,
    acknowledgeAlert,
    clearAllAlerts,
    getActiveAlerts,
    getCriticalAlerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;