import { LayoutDashboard, Calendar, BookOpen, User, Users, BarChart, LogIn } from "lucide-react";
import { lazy } from "react";
import type { ComponentType } from "react";

const LoginPage = lazy(() => import("../pages/p1-auth/LoginPage")); 
const AdminDashboard = lazy(() => import("../pages/p2-admin/AdminDashboard"));
const AdminStudents = lazy(() => import("../pages/p2-admin/a2-students/AdminStudents"));
const AdminProfile = lazy(() => import("../pages/p2-admin/AdminProfile"));

const HODDashboard = lazy(() => import("../pages/p3-hod/HODDashboard"));
const HodStaff = lazy(() => import("../pages/p3-hod/HodStaff"));
const HodReports = lazy(() => import("../pages/p3-hod/HodReports"));

const TeacherDashboard = lazy(() => import("../pages/p4-teacher/TeacherDashboard"));
const TeacherAttendance = lazy(() => import("../pages/p4-teacher/TeacherAttendance"));
const TeacherCourses = lazy(() => import("../pages/p4-teacher/TeacherCourses"));

const StudentDashboard = lazy(() => import("../pages/p5-student/StudentDashboard"));
const StudentAttendance = lazy(() => import("../pages/p5-student/StudentAttendance"));
const StudentCourses = lazy(() => import("../pages/p5-student/StudentCourses"));


export interface RouteConfig {
  path: string;
  icon?: any; 
  label: string;
  roles: string[]; 
  component: ComponentType<any>;
  exact?: boolean;
  children?: RouteConfig[];
}


export const routeConfigs: Record<string, RouteConfig[]> = {
  // PUBLIC ROUTES - accessible to everyone (including unauthenticated users)
  PUBLIC: [
    {
      path: "/login",
      icon: LogIn,
      label: "Login",
      roles: [], 
      component: LoginPage,
      exact: true,
    },
    // {
    //   path: "/register",
    //   icon: UserPlus,
    //   label: "Register",
    //   roles: [],
    //   component: lazy(() => import("../pages/Register")),
    // },
    // {
    //   path: "/forgot-password",
    //   icon: HelpCircle,
    //   label: "Forgot Password",
    //   roles: [],
    //   component: lazy(() => import("../pages/ForgotPassword")),
    // },
  ],

  // PROTECTED ROUTES - require authentication
  ADMIN: [
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["ADMIN"],
      component: AdminDashboard,
      exact: true,
    },
    {
      path: "/admin/students",
      icon: Users,
      label: "Student",
      roles: ["ADMIN"],
      component: AdminStudents,
    },
    {
      path: "/admin/profile",
      icon: User,
      label: "Profile",
      roles: ["ADMIN"],
      component: AdminProfile,
    },
  ],

  HEAD_OF_DEPARTMENT: [
    {
      path: "/hod/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["HEAD_OF_DEPARTMENT"],
      component: HODDashboard,
    },
    {
      path: "/hod/staff",
      icon: Users,
      label: "Staff Management",
      roles: ["HEAD_OF_DEPARTMENT"],
      component: HodStaff,
    },
    {
      path: "/hod/reports",
      icon: BarChart,
      label: "Department Reports",
      roles: ["HEAD_OF_DEPARTMENT"],
      component: HodReports,
    },
  ],

  TEACHER: [
    {
      path: "/teacher/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["TEACHER"],
      component: TeacherDashboard,
    },
    {
      path: "/teacher/attendance",
      icon: Calendar,
      label: "Take Attendance",
      roles: ["TEACHER"],
      component: TeacherAttendance,
    },
    {
      path: "/teacher/courses",
      icon: BookOpen,
      label: "My Courses",
      roles: ["TEACHER"],
      component: TeacherCourses,
    },
  ],

  STUDENT: [
    {
      path: "/student/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["STUDENT"],
      component: StudentDashboard,
    },
    {
      path: "/student/attendance",
      icon: Calendar,
      label: "My Attendance",
      roles: ["STUDENT"],
      component: StudentAttendance,
    },
    {
      path: "/student/courses",
      icon: BookOpen,
      label: "My Courses",
      roles: ["STUDENT"],
      component: StudentCourses,
    },
  ],
};

// Helper functions
export function getAllRoutes(): RouteConfig[] {
  return [
    ...(routeConfigs.PUBLIC || []),
    ...Object.values(routeConfigs).flat().filter(route => 
      route.roles.length > 0 
    )
  ];
}

export function getRoutesByRole(role: string): RouteConfig[] {
  return routeConfigs[role] || [];
}

export function hasRouteAccess(path: string, userRole: string): boolean {
  const allRoutes = getAllRoutes();
  const route = allRoutes.find((r) => r.path === path);
  
  if (route && route.roles.length === 0) {
    return true;
  }
  
  return route ? route.roles.includes(userRole) : false;
}