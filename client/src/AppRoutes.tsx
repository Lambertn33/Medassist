import { Routes, Route } from 'react-router';
import { HomePage, LoginPage, DashboardLayout, DashboardIndex, PatientsPage } from '@/pages';
import { PublicRoute, ProtectedRoute } from '@/components';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardIndex />} />
        <Route path="patients" element={<PatientsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

