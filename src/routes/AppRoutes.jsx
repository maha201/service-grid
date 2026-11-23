import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import CustomersPage from '../features/customers/pages/CustomersPage';
import EquipmentPage from '../features/equipment/pages/EquipmentPage';
import ServiceRequestsPage from '../features/service-requests/pages/ServiceRequestsPage';
import JobsPage from '../features/jobs/pages/JobsPage';
import TechniciansPage from '../features/technicians/pages/TechniciansPage';
import InventoryPage from '../features/inventory/pages/InventoryPage';
import InvoicesPage from '../features/invoices/pages/InvoicesPage';
import ReportsPage from '../features/reports/pages/ReportsPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import ProfilePage from '../features/settings/pages/ProfilePage';
import LandingPage from '../features/landing/pages/LandingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/service-requests" element={<ServiceRequestsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
