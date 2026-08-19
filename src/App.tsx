import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

const AdminDashboardPage = lazy(() =>
  import('./pages/admin/DashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminEntriesPage = lazy(() =>
  import('./pages/admin/EntriesPage').then((m) => ({ default: m.AdminEntriesPage }))
);
const AdminUsersPage = lazy(() =>
  import('./pages/admin/UsersPage').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminPricesPage = lazy(() =>
  import('./pages/admin/PricesPage').then((m) => ({ default: m.AdminPricesPage }))
);
const AdminReportsPage = lazy(() =>
  import('./pages/admin/ReportsPage').then((m) => ({ default: m.AdminReportsPage }))
);
const ReceptionDashboardPage = lazy(() =>
  import('./pages/reception/DashboardPage').then((m) => ({ default: m.ReceptionDashboardPage }))
);
const NewEntryPage = lazy(() =>
  import('./pages/reception/NewEntryPage').then((m) => ({ default: m.NewEntryPage }))
);
const MyEntriesPage = lazy(() =>
  import('./pages/reception/MyEntriesPage').then((m) => ({ default: m.MyEntriesPage }))
);

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
          <Route path="new-entry" element={<NewEntryPage />} />
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

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner label="Chargement de la page..." />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}