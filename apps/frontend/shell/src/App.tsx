import { useEffect, useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { ProviderBoundary } from './components/ProviderBoundary';
import { lazyProvider } from './mf';
import type { DashboardView } from './types/dashboard.types';

interface AuthProviderProps {
  onAuthenticated?: () => void;
}

const ProviderAuthMf = lazyProvider<AuthProviderProps>('authMf', 'App');
const ProviderFinancialMf = lazyProvider('financialMf', 'App');
const ProviderReportsMf = lazyProvider('reportsMf', 'App');

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

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setActiveView('transactions');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
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
          <ProviderAuthMf onAuthenticated={handleAuthenticated} />
        </ProviderBoundary>
      )}

      {activeView === 'transactions' && (
        <ProviderBoundary name="financialMf">
          <ProviderFinancialMf />
        </ProviderBoundary>
      )}

      {activeView === 'reports' && (
        <ProviderBoundary name="reportsMf">
          <ProviderReportsMf />
        </ProviderBoundary>
      )}
    </DashboardLayout>
  );
};

export default App;
