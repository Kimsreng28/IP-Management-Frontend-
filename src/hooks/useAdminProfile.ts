import { useCallback, useState } from "react";
import { adminProfileApi } from "../api/adminProfileApi";
import { useAuthStore } from "../stores/useAuthStore";
import type {
  AdminProfileDto,
  ChangePasswordDto,
  UpdateAdminProfileDto,
} from "../types/adminProfile.types";

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser, updateUser } = useAuthStore();

  // Helper to get current user ID
  const getCurrentUserId = useCallback(() => {
    if (!authUser?.id) {
      throw new Error("User not authenticated");
    }
    return authUser.id;
  }, [authUser]);

  // Fetch current admin profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getCurrentUserId();
      const response = await adminProfileApi.getProfile(userId);
      if (response.success) {
        setProfile(response.data);
      }
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch profile";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserId]);

  // Update current profile
  const updateProfile = useCallback(
    async (data: UpdateAdminProfileDto) => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        console.log("Updating profile with data:", data);
        const response = await adminProfileApi.updateProfile(userId, data);
        console.log("Update response:", response);

        if (response.success) {
          console.log("Response data to set:", response.data);
          setProfile(response.data);
          if (updateUser) {
            console.log("Updating user in Zustand store:", response.data);
            updateUser(response.data);
          }
        }
        return response;
      } catch (err: any) {
        console.error("Update profile error:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to update profile";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId, updateUser]
  );

  // Change current password
  const changePassword = useCallback(
    async (data: ChangePasswordDto) => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        const response = await adminProfileApi.changePassword(userId, data);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to change password";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId]
  );

  // Update current profile image
  const updateProfileImage = useCallback(
    async (imageFile: File) => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        const response = await adminProfileApi.updateProfileImage(
          userId,
          imageFile
        );
        if (response.success) {
          setProfile(response.data);
          // Update user in Zustand store
          if (updateUser) {
            updateUser(response.data);
          }
        }
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to update profile image";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId, updateUser]
  );

  // Clear profile data
  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    updateProfileImage,
    clearProfile,
  };
};
