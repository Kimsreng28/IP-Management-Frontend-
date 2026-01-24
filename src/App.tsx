
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { getAllRoutes } from "./configs/navigation";
import LoadingSpinner from "./components/LoadingSpinner";
import DashboardLayout from "./components/layout/DashboardLayout";


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

  // Separate public and protected routes
  const publicRoutes = allRoutes.filter(route => route.roles.length === 0);
  const protectedRoutes = allRoutes.filter(route => route.roles.length > 0);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Root redirect based on auth state */}
        <Route path="/" element={<Navigate to={getDefaultDashboard()} replace />} />

        {/* Public routes (no layout) */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}

        {/* Protected routes (WITH DashboardLayout) */}
        <Route
          element={
            authUser ? (
              <DashboardLayout
                userName={authUser.name}
                userRole={authUser.role}

              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                // Check if user has access to this route
                route.roles.includes(authUser?.role || "") ? (
                  <route.component />
                ) : (
                  <Navigate to={getDefaultDashboard()} replace />
                )
              }
            />
          ))}
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}