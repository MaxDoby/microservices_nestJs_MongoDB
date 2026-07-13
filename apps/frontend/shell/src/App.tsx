import { DashboardLayout } from './components/DashboardLayout';
import { ProviderBoundary } from './components/ProviderBoundary';
import { RemoteElement } from './components/RemoteElement';
import { useShellState } from './hooks/useShellState';

export const App = () => {
  const { activeView, isAuthenticated, setActiveView, handleLogout } =
    useShellState();

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
