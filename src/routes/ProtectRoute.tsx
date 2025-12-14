// components/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

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
  
  // PUBLIC ROUTES: If route has no roles defined (empty array), it's accessible to everyone
  if (allowedRoles.length === 0) {
    return <>{children}</>
  }
  
  // PROTECTED ROUTES: Require authentication
  // If no user role, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />
  }

  // If user doesn't have required role, redirect to their dashboard
  if (!allowedRoles.includes(userRole)) {
    const dashboardPath = 
      userRole === "ADMIN" ? "/admin/dashboard" :
      userRole === "HEAD_OF_DEPARTMENT" ? "/hod/dashboard" :
      userRole === "TEACHER" ? "/teacher/dashboard" :
      userRole === "STUDENT" ? "/student/dashboard" :
      "/login"
    
    return <Navigate to={dashboardPath} replace />
  }

  // User has access, render the protected content
  return <>{children}</>
}