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
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthState {
  authUser: User | null;
  token: string | null; 
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  hasCheckedInitialAuth: boolean;

  checkAuth: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  setHasCheckedInitialAuth: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      token: null, // Initialize token
      isLoggingIn: false,
      isCheckingAuth: false,
      hasCheckedInitialAuth: false,

      checkAuth: async () => {
        if (get().authUser) {
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
              hasCheckedInitialAuth: true,
            });
            return;
          }
          console.error("checkAuth failed:", error);

          set({
            authUser: null,
            token: null,
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
            hasCheckedInitialAuth: true,
          });

          toast.success("Logged in successfully");
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
            hasCheckedInitialAuth: true,
          });
          toast.success("Logged out successfully");
        }
      },

      setHasCheckedInitialAuth: (value: boolean) => {
        set({ hasCheckedInitialAuth: value });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser,
        token: state.token,
      }),
    }
  )
);
