import {
  BarChart,
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  Key,
  LayoutDashboard,
  Lock,
  LogIn,
  User,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { lazy } from "react";

// Import all existing components
import AdminHods from "../pages/p2-admin/a1-hods/AdminHods";
import AdminTeachers from "../pages/p2-admin/a3-teachers/AdminTeachers";
import AdminDepartments from "../pages/p2-admin/a5-departments/AdminDepartments";
import AdminPrograms from "../pages/p2-admin/a6-programs/AdminPrograms";
import AdminSubjects from "../pages/p2-admin/a7-subjects/AdminSubjects";
import HodProfile from "../pages/p3-hod/HodProfile";
import TeacherProfile from "../pages/p4-teacher/TeacherProfile";
import StudentProfile from "../pages/p5-student/StudentProfile";
const AdminSchedules = lazy(
  () => import("../pages/p2-admin/a8-schedule/AdminSchedules"),
);
const TeacherSchedules = lazy(
  () => import("../pages/p4-teacher/TeacherSchedules"),
);
const StudentSchedules = lazy(
  () => import("../pages/p5-student/StudentSchedules"),
);
const HODSchedules = lazy(() => import("../pages/p3-hod/HODSchedules"));

// Lazy load existing pages
const LoginPage = lazy(() => import("../pages/p1-auth/LoginPage"));
const AdminDashboard = lazy(() => import("../pages/p2-admin/AdminDashboard"));
const AdminStudents = lazy(
  () => import("../pages/p2-admin/a2-students/AdminStudents"),
);
const AdminProfile = lazy(() => import("../pages/p2-admin/AdminProfile"));

const HODDashboard = lazy(() => import("../pages/p3-hod/HODDashboard"));
const HodStaff = lazy(() => import("../pages/p3-hod/HodStaff"));
const HodReports = lazy(() => import("../pages/p3-hod/HodReports"));

const TeacherDashboard = lazy(
  () => import("../pages/p4-teacher/TeacherDashboard"),
);
const TeacherAttendance = lazy(
  () => import("../pages/p4-teacher/TeacherAttendance"),
);
const TeacherCourses = lazy(() => import("../pages/p4-teacher/TeacherCourses"));

const StudentDashboard = lazy(
  () => import("../pages/p5-student/StudentDashboard"),
);
const StudentAttendance = lazy(
  () => import("../pages/p5-student/StudentAttendance"),
);
const StudentCourses = lazy(() => import("../pages/p5-student/StudentCourses"));

// Lazy load new password-related pages
const ForgotPasswordPage = lazy(
  () => import("../pages/p1-auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("../pages/p1-auth/ResetPasswordPage"),
);

// Define interface for route configurations
export interface RouteConfig {
  path: string;
  icon?: any;
  label: string;
  roles: string[];
  component: ComponentType<any>;
  exact?: boolean;
  children?: RouteConfig[];
}

// Define route configurations
export const routeConfigs: Record<string, RouteConfig[]> = {
  // PUBLIC ROUTES
  PUBLIC: [
    {
      path: "/login",
      icon: LogIn,
      label: "Login",
      roles: [],
      component: LoginPage,
      exact: true,
    },
    {
      path: "/forgot-password",
      icon: Key,
      label: "Forgot Password",
      roles: [],
      component: ForgotPasswordPage,
    },
    {
      path: "/reset-password/:token",
      icon: Lock,
      label: "Reset Password",
      roles: [],
      component: ResetPasswordPage,
    },
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
      path: "/admin/teachers",
      icon: Users,
      label: "Teacher",
      roles: ["ADMIN"],
      component: AdminTeachers,
    },
    {
      path: "/admin/hods",
      icon: Users,
      label: "Heads of Department",
      roles: ["ADMIN"],
      component: AdminHods,
    },
    {
      path: "/admin/departments",
      icon: Building2,
      label: "Department",
      roles: ["ADMIN"],
      component: AdminDepartments,
    },
    {
      path: "/admin/programs",
      icon: GraduationCap,
      label: "Program",
      roles: ["ADMIN"],
      component: AdminPrograms,
    },
    {
      path: "/admin/subjects",
      icon: BookOpen,
      label: "Subject",
      roles: ["ADMIN"],
      component: AdminSubjects,
    },
    {
      path: "/admin/schedules",
      icon: Calendar,
      label: "Schedule",
      roles: ["ADMIN"],
      component: AdminSchedules,
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
    {
      path: "/hod/profile",
      icon: User,
      label: "Profile",
      roles: ["HEAD_OF_DEPARTMENT"],
      component: HodProfile,
    },
    {
      path: "/hod/schedules",
      icon: Calendar,
      label: "Schedule",
      roles: ["HEAD_OF_DEPARTMENT"],
      component: HODSchedules,
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
    {
      path: "/teacher/profile",
      icon: User,
      label: "Profile",
      roles: ["TEACHER"],
      component: TeacherProfile,
    },
    {
      path: "/teacher/schedules",
      icon: Calendar,
      label: "Schedule",
      roles: ["TEACHER"],
      component: TeacherSchedules,
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
    {
      path: "/student/profile",
      icon: User,
      label: "Profile",
      roles: ["STUDENT"],
      component: StudentProfile,
    },
    {
      path: "/student/schedules",
      icon: Calendar,
      label: "Schedule",
      roles: ["STUDENT"],
      component: StudentSchedules,
    },
  ],
};

// Helper functions
export function getAllRoutes(): RouteConfig[] {
  return [
    ...(routeConfigs.PUBLIC || []),
    ...Object.values(routeConfigs)
      .flat()
      .filter((route) => route.roles.length > 0),
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
