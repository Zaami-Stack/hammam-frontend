import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/admin/DashboardPage';
import { AdminEntriesPage } from './pages/admin/EntriesPage';
import { AdminUsersPage } from './pages/admin/UsersPage';
import { AdminPricesPage } from './pages/admin/PricesPage';
import { AdminReportsPage } from './pages/admin/ReportsPage';
import { ReceptionDashboardPage } from './pages/reception/DashboardPage';
import { NewEntryPage } from './pages/reception/NewEntryPage';
import { MyEntriesPage } from './pages/reception/MyEntriesPage';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={user.role === 'ADMIN' ? '/admin/dashboard' : '/reception/dashboard'}
      replace
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="entries" element={<AdminEntriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="prices" element={<AdminPricesPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRole="RECEPTION" />}>
        <Route path="/reception" element={<AppLayout />}>
          <Route index element={<Navigate to="/reception/dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionDashboardPage />} />
          <Route path="new-entry" element={<NewEntryPage />} />
          <Route path="my-entries" element={<MyEntriesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}