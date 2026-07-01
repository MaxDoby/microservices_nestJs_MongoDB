import type { DashboardView } from '../types/dashboard.types';

interface DashboardNavProps {
  activeView: DashboardView;
  isAuthenticated: boolean;
  onChangeView: (view: DashboardView) => void;
  onLogout: () => void;
}

export const DashboardNav = ({
  activeView,
  isAuthenticated,
  onChangeView,
  onLogout,
}: DashboardNavProps) => {
  return (
    <nav className="dashboard-nav">
      <button
        type="button"
        className={activeView === 'auth' ? 'active' : ''}
        onClick={() => onChangeView('auth')}
      >
        Sign In
      </button>

      {isAuthenticated && (
        <>
          <button
            type="button"
            className={activeView === 'transactions' ? 'active' : ''}
            onClick={() => onChangeView('transactions')}
          >
            Transactions
          </button>

          <button
            type="button"
            className={activeView === 'reports' ? 'active' : ''}
            onClick={() => onChangeView('reports')}
          >
            Reports
          </button>

          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};
