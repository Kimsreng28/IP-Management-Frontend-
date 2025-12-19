import { axiosInstance } from "../lib/axios";
import type {
  AdminProfileResponseDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
  UpdateAdminProfileDto,
} from "../types/adminProfile.types";

const API_IMAGE_BASE_URL = import.meta.env.VITE_MINIO_URL;

export const adminProfileApi = {
  // Get admin profile
  getProfile: async () => {
    const response = await axiosInstance.get("/admin/profile");
    return response.data;
  },

  // Update admin profile
  updateProfile: async (
    data: UpdateAdminProfileDto
  ): Promise<AdminProfileResponseDto> => {
    const response = await axiosInstance.put("/admin/profile", data);
    return response.data;
  },

  // Change password
  changePassword: async (
    data: ChangePasswordDto
  ): Promise<ChangePasswordResponseDto> => {
    const response = await axiosInstance.put("/admin/profile/password", data);
    return response.data;
  },

  // Update profile image
  updateProfileImage: async (
    imageFile: File
  ): Promise<AdminProfileResponseDto> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.put(
      "/admin/profile/avatar",
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
