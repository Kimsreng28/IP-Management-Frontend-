import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';

// Placeholder pages
const Attendance = () => <div className="p-6">Attendance Page</div>;
const LeaveRequest = () => <div className="p-6">Leave Request Page</div>;
const ELibrary = () => <div className="p-6">E-Library Page</div>;
const Profile = () => <div className="p-6">Profile Page</div>;

const AppRoutes: React.FC = () => {
  const { checkAuth, hasCheckedInitialAuth, setHasCheckedInitialAuth, authUser } = useAuthStore();
  const location = useLocation();

  // Check auth only once when app loads (on root path)
  useEffect(() => {
    // Only check auth if we haven't checked yet
    if (!hasCheckedInitialAuth) {
      checkAuth();
      setHasCheckedInitialAuth(true);
    }
  }, [checkAuth, hasCheckedInitialAuth, setHasCheckedInitialAuth]);

  // Show loading only on initial auth check
  if (!hasCheckedInitialAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        // If already logged in, redirect to dashboard
        authUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        // Root path - redirect based on auth status
        authUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
      
      {/* All dashboard routes are protected */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={
          // Protect dashboard route
          authUser ? <Dashboard /> : <Navigate to="/login" replace state={{ from: location }} />
        } />
        <Route path="/attendance" element={
          authUser ? <Attendance /> : <Navigate to="/login" replace state={{ from: location }} />
        } />
        <Route path="/leave-request" element={
          authUser ? <LeaveRequest /> : <Navigate to="/login" replace state={{ from: location }} />
        } />
        <Route path="/e-library" element={
          authUser ? <ELibrary /> : <Navigate to="/login" replace state={{ from: location }} />
        } />
        <Route path="/profile" element={
          authUser ? <Profile /> : <Navigate to="/login" replace state={{ from: location }} />
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={
        <Navigate to={authUser ? "/dashboard" : "/login"} replace />
      } />
    </Routes>
  );
};

export default AppRoutes;