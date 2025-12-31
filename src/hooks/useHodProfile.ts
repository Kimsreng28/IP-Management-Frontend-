import { useCallback, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../stores/useAuthStore";

export const useHodProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser, updateUser } = useAuthStore();

  const getCurrentUserId = useCallback(() => {
    if (!authUser?.id) {
      throw new Error("User not authenticated");
    }
    return authUser.id;
  }, [authUser]);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/hod/profile/me`);
      if (response.data.success) {
        setProfile(response.data.data);
      }
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch profile";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        const response = await axiosInstance.put(
          `/hod/profile/${userId}`,
          data
        );

        if (response.data.success) {
          setProfile(response.data.data);
          if (updateUser) {
            updateUser(response.data.data);
          }
        }
        return response.data;
      } catch (err: any) {
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

  const changePassword = useCallback(
    async (data: { currentPassword: string; newPassword: string }) => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        const response = await axiosInstance.put(
          `/hod/profile/password/${userId}`,
          data
        );
        return response.data;
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

  const updateProfileImage = useCallback(
    async (imageFile: File) => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axiosInstance.put(
          `/hod/profile/avatar/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          setProfile(response.data.data);
          if (updateUser) {
            updateUser(response.data.data);
          }
        }
        return response.data;
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
