import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  User,
  Users,
  Settings,
  FileText,
  BarChart,
  Building,
  BookMarked,
  ClipboardCheck
} from 'lucide-react';

export interface MenuItem {
  path: string;
  icon: any;
  label: string;
  roles: string[]; // Which roles can access this menu
}

export const menuConfigs: Record<string, MenuItem[]> = {
  // Admin Navigation
  ADMIN: [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN'] },
    { path: '/admin/users', icon: Users, label: 'User Management', roles: ['ADMIN'] },
    { path: '/admin/departments', icon: Building, label: 'Departments', roles: ['ADMIN'] },
    { path: '/admin/courses', icon: BookMarked, label: 'Courses', roles: ['ADMIN'] },
    { path: '/admin/reports', icon: BarChart, label: 'Reports', roles: ['ADMIN'] },
    { path: '/admin/settings', icon: Settings, label: 'System Settings', roles: ['ADMIN'] },
  ],

  // Head of Department Navigation
  HEAD_OF_DEPARTMENT: [
    { path: '/hod/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['HEAD_OF_DEPARTMENT'] },
    { path: '/hod/attendance', icon: ClipboardCheck, label: 'Department Attendance', roles: ['HEAD_OF_DEPARTMENT'] },
    { path: '/hod/leave-requests', icon: FileText, label: 'Leave Approvals', roles: ['HEAD_OF_DEPARTMENT'] },
    { path: '/hod/staff', icon: Users, label: 'Staff Management', roles: ['HEAD_OF_DEPARTMENT'] },
    { path: '/hod/reports', icon: BarChart, label: 'Department Reports', roles: ['HEAD_OF_DEPARTMENT'] },
  ],

  // Teacher Navigation
  TEACHER: [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['TEACHER'] },
    { path: '/teacher/attendance', icon: Calendar, label: 'Take Attendance', roles: ['TEACHER'] },
    { path: '/teacher/courses', icon: BookOpen, label: 'My Courses', roles: ['TEACHER'] },
    { path: '/teacher/leave', icon: Calendar, label: 'Leave Request', roles: ['TEACHER'] },
    { path: '/teacher/e-library', icon: BookOpen, label: 'E-Library', roles: ['TEACHER'] },
    { path: '/teacher/grades', icon: FileText, label: 'Grade Students', roles: ['TEACHER'] },
  ],

  // Student Navigation
  STUDENT: [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['STUDENT'] },
    { path: '/student/attendance', icon: Calendar, label: 'My Attendance', roles: ['STUDENT'] },
    { path: '/student/courses', icon: BookOpen, label: 'My Courses', roles: ['STUDENT'] },
    { path: '/student/leave', icon: Calendar, label: 'Leave Request', roles: ['STUDENT'] },
    { path: '/student/e-library', icon: BookOpen, label: 'E-Library', roles: ['STUDENT'] },
    { path: '/student/grades', icon: FileText, label: 'My Grades', roles: ['STUDENT'] },
  ],
};

// Common menu items for all roles (profile, logout)
export const commonMenuItems: MenuItem[] = [
  { path: '/profile', icon: User, label: 'Profile', roles: ['ADMIN', 'HEAD_OF_DEPARTMENT', 'TEACHER', 'STUDENT'] },
];