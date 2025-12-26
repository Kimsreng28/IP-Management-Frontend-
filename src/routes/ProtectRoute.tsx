import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: string[]
  userRole?: string
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  userRole
}: ProtectedRouteProps) {
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  // PUBLIC ROUTES
  if (allowedRoles.length === 0) {
    return <>{children}</>
  }

  // PROTECTED ROUTES - Check if user is authenticated
  if (!userRole) {
    return <Navigate to="/login" replace />
  }

  // Check if user has permission for this route
  if (!allowedRoles.includes(userRole)) {
    const dashboardPath =
      userRole === "ADMIN" ? "/admin/dashboard" :
        userRole === "HEAD_OF_DEPARTMENT" ? "/hod/dashboard" :
          userRole === "TEACHER" ? "/teacher/dashboard" :
            userRole === "STUDENT" ? "/student/dashboard" :
              "/login"

    return <Navigate to={dashboardPath} replace />
  }

  // For STUDENT role, check if password change is required
  if (userRole === "STUDENT") {
    useEffect(() => {
      const checkPasswordRequirement = async () => {
        setIsCheckingPassword(true);
        try {
          const response = await axiosInstance.get('/auth/check-password-required');
          setRequiresPasswordChange(response.data.requiresChange);
        } catch (error) {
          console.error('Error checking password requirement:', error);
          setRequiresPasswordChange(false);
        } finally {
          setIsCheckingPassword(false);
        }
      };

      checkPasswordRequirement();
    }, [userRole]);

    // Show loading while checking
    if (isCheckingPassword) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking security...</p>
          </div>
        </div>
      );
    }

    // If password change is required, redirect to login (where modal will show)
    if (requiresPasswordChange) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>
}