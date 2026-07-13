import { useEffect, useState } from 'react';
import { logoutRequest } from '@financial-tracker/frontend-auth';
import type { DashboardView } from '../types/dashboard.types';

export const useShellState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem('accessToken')),
  );
  const [activeView, setActiveView] = useState<DashboardView>(() =>
    localStorage.getItem('accessToken') ? 'transactions' : 'auth',
  );

  useEffect(() => {
    if (!isAuthenticated && activeView !== 'auth') {
      setActiveView('auth');
    }
  }, [activeView, isAuthenticated]);

  useEffect(() => {
    window.addEventListener('ft:auth:authenticated', handleAuthenticated);

    return () => {
      window.removeEventListener('ft:auth:authenticated', handleAuthenticated);
    };
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setActiveView('transactions');
  };

  const handleLogout = async () => {
    await logoutRequest();
    setIsAuthenticated(false);
    setActiveView('auth');
  };

  return {
    activeView,
    isAuthenticated,
    setActiveView,
    handleLogout,
  };
};
