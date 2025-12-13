import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthState {
  authUser: User | null;
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
              hasCheckedInitialAuth: true,
            });
            return;
          }
          console.error("checkAuth failed:", error);

          set({
            authUser: null,
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
          set({
            authUser: res.data,
            hasCheckedInitialAuth: true,
          });
          toast.success("Logged in successfully");
        } catch (error: any) {
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
          set({
            authUser: null,
            hasCheckedInitialAuth: true,
          });
          toast.success("Logged out successfully");
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Logout failed";
          toast.error(errorMessage);
          // Still clear local state even if server logout fails
          set({
            authUser: null,
            hasCheckedInitialAuth: true,
          });
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
      }),
    }
  )
);
