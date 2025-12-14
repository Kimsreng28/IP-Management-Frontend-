// src/routes/AppRoutes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { getAllRoutes } from "../configs/navigation";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../stores/useAuthStore";

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
        {/* Root redirect based on auth state */}
        <Route path="/" element={<Navigate to={getDefaultDashboard()} replace />} />

        {/* All configured routes */}
        {allRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              // Public routes (like login) → render directly
              route.roles.length === 0 ? (
                <route.component />
              ) : (
                // Protected routes → just render the page component
                // (DashboardLayout is already wrapped in App.tsx)
                <route.component />
              )
            }
          />
        ))}

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}