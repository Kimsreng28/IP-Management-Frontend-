import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/p1-auth/LoginPage';
import AdminDashboard from '../pages/p2-admin/AdminDashboard';
import AdminUsers from '../pages/p2-admin/AdminUsers';
import AdminDepartments from '../pages/p2-admin/AdminDepartments';
import HODDashboard from '../pages/p3-hod/HODDashboard';
import HODAttendance from '../pages/p3-hod/HODAttendance';
import TeacherDashboard from '../pages/p4-teacher/TeacherDashboard';
import TeacherAttendance from '../pages/p4-teacher/TeacherAttendance';
import StudentDashboard from '../pages/p5-student/StudentDashboard';
import StudentAttendance from '../pages/p5-student/StudentAttendance';
import Profile from '../pages/Profile';

// Role-based route guard component
const RoleRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { authUser } = useAuthStore();
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(authUser.role)) {
    // Redirect to role-specific dashboard
    const rolePathMap: Record<string, string> = {
      'ADMIN': '/admin/dashboard',
      'HEAD_OF_DEPARTMENT': '/hod/dashboard',
      'TEACHER': '/teacher/dashboard',
      'STUDENT': '/student/dashboard'
    };
    const redirectPath = rolePathMap[authUser.role] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { checkAuth, hasCheckedInitialAuth, setHasCheckedInitialAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!hasCheckedInitialAuth) {
      checkAuth();
      setHasCheckedInitialAuth(true);
    }
  }, [checkAuth, hasCheckedInitialAuth, setHasCheckedInitialAuth]);

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

  // Function to get default route based on role
  const getDefaultRoute = () => {
    if (!authUser || !authUser.role) return '/login';
    
    // Map role to dashboard path
    const rolePathMap: Record<string, string> = {
      'ADMIN': '/admin/dashboard',
      'HEAD_OF_DEPARTMENT': '/hod/dashboard',
      'TEACHER': '/teacher/dashboard',
      'STUDENT': '/student/dashboard'
    };
    
    return rolePathMap[authUser.role] || '/login';
  };

  // Get the current user's default route
  const defaultRoute = authUser ? getDefaultRoute() : '/login';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        authUser ? <Navigate to={defaultRoute} replace /> : <LoginPage />
      } />
      
      {/* Root redirect */}
      <Route path="/" element={
        <Navigate to={defaultRoute} replace />
      } />
      
      {/* Protected Routes within Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        {/* ADMIN Routes */}
        <Route path="/admin/dashboard" element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RoleRoute>
        } />
        <Route path="/admin/users" element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </RoleRoute>
        } />
        <Route path="/admin/departments" element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminDepartments />
          </RoleRoute>
        } />
        
        {/* HEAD_OF_DEPARTMENT Routes */}
        <Route path="/hod/dashboard" element={
          <RoleRoute allowedRoles={['HEAD_OF_DEPARTMENT']}>
            <HODDashboard />
          </RoleRoute>
        } />
        <Route path="/hod/attendance" element={
          <RoleRoute allowedRoles={['HEAD_OF_DEPARTMENT']}>
            <HODAttendance />
          </RoleRoute>
        } />
        
        {/* TEACHER Routes */}
        <Route path="/teacher/dashboard" element={
          <RoleRoute allowedRoles={['TEACHER']}>
            <TeacherDashboard />
          </RoleRoute>
        } />
        <Route path="/teacher/attendance" element={
          <RoleRoute allowedRoles={['TEACHER']}>
            <TeacherAttendance />
          </RoleRoute>
        } />
        
        {/* STUDENT Routes */}
        <Route path="/student/dashboard" element={
          <RoleRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </RoleRoute>
        } />
        <Route path="/student/attendance" element={
          <RoleRoute allowedRoles={['STUDENT']}>
            <StudentAttendance />
          </RoleRoute>
        } />
        
        {/* Common Routes accessible to all authenticated users */}
        <Route path="/profile" element={
          authUser ? <Profile /> : <Navigate to="/login" replace />
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={
        <Navigate to={defaultRoute} replace />
      } />
    </Routes>
  );
};

export default AppRoutes;