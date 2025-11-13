import { Routes, Route } from 'react-router';
import { HomePage, LoginPage, DashboardLayout, DashboardIndex, PatientsPage, PatientDetailsPage, EncountersPage, EncountersDetailsPage, UsersPage } from '@/pages';
import { PublicRoute, ProtectedRoute, AdminRoute } from '@/components';

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
        <Route path="patients/:id" element={<PatientDetailsPage />} />
        <Route path="encounters" element={<EncountersPage />} />
        <Route path="encounters/:encounterId" element={<EncountersDetailsPage />} />
        <Route
          path="users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;   

