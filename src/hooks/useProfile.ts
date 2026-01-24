import { useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useAdminProfile } from "./useAdminProfile";
import { useHodProfile } from "./useHodProfile";
import { useStudentProfile } from "./useStudentProfile";
import { useTeacherProfile } from "./useTeacherProfile";

export const useProfile = () => {
  const { authUser } = useAuthStore();

  // Create hooks conditionally based on role
  const adminProfileHook = useAdminProfile();
  const hodProfileHook = useHodProfile();
  const studentProfileHook = useStudentProfile();
  const teacherProfileHook = useTeacherProfile();

  // Get the appropriate hook based on user role using useMemo
  const profileHook = useMemo(() => {
    if (!authUser?.role) {
      return null;
    }

    const role = authUser.role.toLowerCase();

    if (role === "admin") {
      return adminProfileHook;
    } else if (role === "head_of_department") {
      return hodProfileHook;
    } else if (role === "student") {
      return studentProfileHook;
    } else if (role === "teacher") {
      return teacherProfileHook;
    } else {
      return null;
    }
  }, [
    authUser?.role,
    adminProfileHook,
    hodProfileHook,
    studentProfileHook,
    teacherProfileHook,
  ]);

  return {
    profile: profileHook?.profile || null,
    loading: profileHook?.loading || false,
    error: profileHook?.error || null,
    fetchProfile: profileHook?.fetchProfile || (() => Promise.resolve()),
    clearProfile: profileHook?.clearProfile || (() => {}),
  };
};
