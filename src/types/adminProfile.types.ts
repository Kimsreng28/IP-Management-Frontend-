export interface AdminProfileDto {
  id: string;
  name_kh: string;
  name_en: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  role: string;
  image?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AdminProfileResponseDto {
  success: boolean;
  message: string;
  data: AdminProfileDto;
}

export interface UpdateAdminProfileDto {
  name_kh?: string;
  name_en?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  success: boolean;
  message: string;
}
