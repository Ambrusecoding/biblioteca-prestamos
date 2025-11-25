import { Outlet } from 'react-router-dom';
import { Navigation } from '../../organisms/Navigation/Navigation';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Navigation />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

