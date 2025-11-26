import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layouts/DashboardLayout';

// Placeholder pages for other routes
const Attendance = () => <div className="p-6">Attendance Page</div>;
const LeaveRequest = () => <div className="p-6">Leave Request Page</div>;
const ELibrary = () => <div className="p-6">E-Library Page</div>;
const Profile = () => <div className="p-6">Profile Page</div>;

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="leave-request" element={<LeaveRequest />} />
                <Route path="e-library" element={<ELibrary />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;