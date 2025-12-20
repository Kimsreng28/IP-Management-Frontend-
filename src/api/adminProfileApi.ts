import { axiosInstance } from "../lib/axios";
import type {
  AdminProfileResponseDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
  UpdateAdminProfileDto,
} from "../types/adminProfile.types";

const API_IMAGE_BASE_URL = import.meta.env.VITE_MINIO_URL;

export const adminProfileApi = {
  // Get current admin profile
  getProfile: async (id?: string): Promise<AdminProfileResponseDto> => {
    const endpoint = id ? `/admin/profile/${id}` : `/admin/profile`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  // Update admin profile
  updateProfile: async (
    id: string,
    data: UpdateAdminProfileDto
  ): Promise<AdminProfileResponseDto> => {
    const response = await axiosInstance.put(`/admin/profile/${id}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (
    id: string,
    data: ChangePasswordDto
  ): Promise<ChangePasswordResponseDto> => {
    const response = await axiosInstance.put(
      `/admin/profile/password/${id}`,
      data
    );
    return response.data;
  },

  // Update profile image
  updateProfileImage: async (
    id: string,
    imageFile: File
  ): Promise<AdminProfileResponseDto> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.put(
      `/admin/profile/avatar/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
