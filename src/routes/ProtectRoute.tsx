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
  
  // PUBLIC ROUTES
  if (allowedRoles.length === 0) {
    return <>{children}</>
  }
  
  // PROTECTED ROUTES
  if (!userRole) {
    return <Navigate to="/login" replace />
  }
  if (!allowedRoles.includes(userRole)) {
    const dashboardPath = 
      userRole === "ADMIN" ? "/admin/dashboard" :
      userRole === "HEAD_OF_DEPARTMENT" ? "/hod/dashboard" :
      userRole === "TEACHER" ? "/teacher/dashboard" :
      userRole === "STUDENT" ? "/student/dashboard" :
      "/login"
    
    return <Navigate to={dashboardPath} replace />
  }

  return <>{children}</>
}