import { useEffect, useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { ProviderBoundary } from './components/ProviderBoundary';
import type { DashboardView } from './types/dashboard.types';
import { logoutRequest } from '@financial-tracker/frontend-auth';
import { RemoteElement } from './components/RemoteElement';

export const App = () => {
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

  return (
    <DashboardLayout
      activeView={activeView}
      isAuthenticated={isAuthenticated}
      onChangeView={setActiveView}
      onLogout={handleLogout}
    >
      {activeView === 'auth' && (
        <ProviderBoundary name="authMf">
          <RemoteElement
            alias="authMf"
            exposeName="element"
            tagName="ft-auth"
          />
        </ProviderBoundary>
      )}

      {activeView === 'transactions' && (
        <ProviderBoundary name="financialMf">
          <RemoteElement
            alias="financialMf"
            exposeName="element"
            tagName="ft-transactions"
          />
        </ProviderBoundary>
      )}

      {activeView === 'reports' && (
        <ProviderBoundary name="reportsMf">
          <RemoteElement
            alias="reportsMf"
            exposeName="element"
            tagName="ft-reports"
          />
        </ProviderBoundary>
      )}
    </DashboardLayout>
  );
};

export default App;
