import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  image?: string;
  name_kh?: string;
  name_en?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  is_active?: boolean;
  passwordChanged?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthState {
  authUser: User | null;
  token: string | null;
  tempToken: string | null;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  hasCheckedInitialAuth: boolean;

  checkAuth: () => Promise<void>;
  login: (data: LoginData) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setHasCheckedInitialAuth: (value: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
  setTempToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      token: null,
      tempToken: null,
      isLoggingIn: false,
      isCheckingAuth: false,
      hasCheckedInitialAuth: false,

      checkAuth: async () => {
        const { authUser, token } = get();

        if (!authUser && !token) {
          set({ hasCheckedInitialAuth: true, isCheckingAuth: false });
          return;
        }

        if (authUser) {
          set({ hasCheckedInitialAuth: true });
          return;
        }

        set({ isCheckingAuth: true });

        try {
          const res = await axiosInstance.get("/auth/check");
          set({
            authUser: res.data,
            hasCheckedInitialAuth: true,
          });
        } catch (error: any) {
          if (error.response?.status === 401) {
            set({
              authUser: null,
              token: null,
              tempToken: null,
              hasCheckedInitialAuth: true,
            });
            return;
          }
          console.error("checkAuth failed:", error);
          set({
            authUser: null,
            token: null,
            tempToken: null,
            hasCheckedInitialAuth: true,
          });
          toast.error("Authentication check failed");
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      login: async (data: LoginData) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          console.log("Login API response:", res.data);

          // Check if password change is required
          if (res.data.requiresPasswordChange) {
            set({
              tempToken: res.data.tempToken,
              authUser: res.data.user,
            });
            return res.data; // Return the response for handling
          }

          const userData = res.data.user || res.data;
          const tokenData = res.data.token || null;

          const normalizedUser = {
            ...userData,
            role: userData.role.toUpperCase(),
          };

          console.log("Setting authUser:", normalizedUser);

          set({
            authUser: normalizedUser,
            token: tokenData,
            tempToken: null,
            hasCheckedInitialAuth: true,
          });

          toast.success("Logged in successfully");
          return res.data;
        } catch (error: any) {
          console.error("Login error:", error);
          const errorMessage = error.response?.data?.message || "Login failed";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            authUser: null,
            token: null,
            tempToken: null,
            hasCheckedInitialAuth: true,
          });
          toast.success("Logged out successfully");
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const response = await axiosInstance.post("/auth/forgot-password", { email });
          toast.success(response.data.message || "Reset link sent to your email");
          return response.data;
        } catch (error: any) {
          console.error("Forgot password error:", error);
          const errorMessage = error.response?.data?.message || "Failed to send reset link";
          toast.error(errorMessage);
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          const response = await axiosInstance.post("/auth/reset-password", {
            token,
            newPassword
          });
          toast.success(response.data.message || "Password reset successfully");
          return response.data;
        } catch (error: any) {
          console.error("Reset password error:", error);
          const errorMessage = error.response?.data?.message || "Failed to reset password";
          toast.error(errorMessage);
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const response = await axiosInstance.post("/auth/change-password", {
            currentPassword,
            newPassword
          });
          toast.success(response.data.message || "Password changed successfully");
          return response.data;
        } catch (error: any) {
          console.error("Change password error:", error);
          const errorMessage = error.response?.data?.message || "Failed to change password";
          toast.error(errorMessage);
          throw error;
        }
      },

      setHasCheckedInitialAuth: (value: boolean) => {
        set({ hasCheckedInitialAuth: value });
      },

      updateUser: (userData: Partial<User>) => {
        console.log('Current authUser before update:', get().authUser);
        console.log('User data to merge:', userData);

        set((state) => ({
          authUser: state.authUser ? {
            ...state.authUser,
            ...userData,
            id: state.authUser.id,
            email: state.authUser.email,
            role: state.authUser.role,
          } : null,
        }));

        console.log('Updated authUser:', get().authUser);
      },

      setTempToken: (token: string | null) => {
        set({ tempToken: token });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser,
        token: state.token,
        tempToken: state.tempToken,
      }),
    }
  )
);