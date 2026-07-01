import type { ReactNode } from 'react';
import { DashboardNav } from './DashboardNav';
import type { DashboardView } from '../types/dashboard.types';

interface DashboardLayoutProps {
  activeView: DashboardView;
  isAuthenticated: boolean;
  onChangeView: (view: DashboardView) => void;
  onLogout: () => void;
  children: ReactNode;
}

export const DashboardLayout = ({
  activeView,
  isAuthenticated,
  onChangeView,
  onLogout,
  children,
}: DashboardLayoutProps) => {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Financial Tracker</h1>
          <h4>Accounting dashboard</h4>
        </div>

        <DashboardNav
          activeView={activeView}
          isAuthenticated={isAuthenticated}
          onChangeView={onChangeView}
          onLogout={onLogout}
        />
      </header>

      <section className="dashboard-content">{children}</section>
    </main>
  );
};
