import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { getAllRoutes } from "../configs/navigation";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../stores/useAuthStore";
import ProtectedRoute from "./ProtectRoute";

export default function AppRoutes() {
  const { authUser } = useAuthStore();
  const allRoutes = getAllRoutes();

  const getDefaultDashboard = () => {
    if (!authUser) return "/login";
    switch (authUser.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "HEAD_OF_DEPARTMENT":
        return "/hod/dashboard";
      case "TEACHER":
        return "/teacher/dashboard";
      case "STUDENT":
        return "/student/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={getDefaultDashboard()} replace />}
        />

        {/* All configured routes */}
        {allRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute
                allowedRoles={route.roles}
                userRole={authUser?.role}
              >
                <route.component />
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}