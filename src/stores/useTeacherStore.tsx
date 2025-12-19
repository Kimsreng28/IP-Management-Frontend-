import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Teacher {
  id: string;
  teacher_id: string;
  name_kh: string;
  name_en: string;
  email?: string;
  phone?: string;
  department: string;
  gender: "Male" | "Female";
  dob?: string;
  address?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

interface Department {
  id: number;
  name: string;
}

interface FilterParams {
  department?: string;
  gender?: string;
  search?: string;
  sort_by?: "dob" | "name_en" | "name_kh" | "teacher_id";
  sort_order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
}

interface TeachersResponse {
  success: boolean;
  message: string;
  data: Teacher[];
  data_setup: {
    departments: Department[];
  };
  meta: MetaData;
}

interface TeacherState {
  // Data
  teachers: Teacher[];
  departments: Department[];
  meta: MetaData | null;

  // UI State
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Filters
  filters: FilterParams;

  // Actions
  fetchTeachers: (params?: Partial<FilterParams>) => Promise<void>;
  fetchTeacherById: (id: string) => Promise<Teacher | null>;
  createTeacher: (data: FormData) => Promise<void>; // Add this
  updateTeacher: (
    id: string,
    data: Partial<Teacher> | FormData
  ) => Promise<void>; // Add this for future use
  deleteTeacher: (id: string) => Promise<void>; // Add this for future use

  // Filter management
  setFilter: (
    key: keyof FilterParams,
    value: string | number | undefined
  ) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  resetFilters: () => void;

  // Pagination
  goToPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
}

const defaultFilters: FilterParams = {
  department: "",
  gender: "",
  search: "",
  sort_by: "teacher_id",
  sort_order: "ASC",
  page: 1,
  limit: 10,
};

export const useTeacherStore = create<TeacherState>((set, get) => ({
  // Initial state
  teachers: [],
  departments: [],
  meta: null,

  isLoading: false,
  isFetching: false,
  error: null,

  filters: defaultFilters,

  // Fetch teachers with filters
  fetchTeachers: async (params?: Partial<FilterParams>) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, ...params };

    set({ isFetching: true, filters: newFilters });

    try {
      // Build query params
      const queryParams = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const response = await axiosInstance.get<TeachersResponse>(
        `/admin/teachers?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          teachers: response.data.data,
          departments: response.data.data_setup.departments,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch teachers");
      }
    } catch (error: any) {
      console.error("Error fetching teachers:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load teachers";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  // Fetch single teacher
  fetchTeacherById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Teacher }>(
        `/admin/teachers/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching teacher:", error);
      toast.error(error.response?.data?.message || "Failed to fetch teacher");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create teacher
  createTeacher: async (data: FormData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/admin/teachers", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Teacher created successfully");
      await get().fetchTeachers();
    } catch (error: any) {
      console.error("Error creating teacher:", error);
      toast.error(error.response?.data?.message || "Failed to create teacher");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update teacher (for future use)
  updateTeacher: async (id: string, data: Partial<Teacher> | FormData) => {
    set({ isLoading: true });
    try {
      if (data instanceof FormData) {
        // Handle FormData (for updates with image)
        await axiosInstance.patch(`/admin/teachers/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Handle regular JSON data
        await axiosInstance.patch(`/admin/teachers/${id}`, data);
      }
      toast.success("Teacher updated successfully");
      // Refresh the list
      await get().fetchTeachers();
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      toast.error(error.response?.data?.message || "Failed to update teacher");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete teacher (for future use)
  deleteTeacher: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/admin/teachers/${id}`);
      toast.success("Teacher deleted successfully");
      // Refresh the list
      await get().fetchTeachers();
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to delete teacher");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Filter management
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 }, 
    }));
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  // Pagination
  goToPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    get().fetchTeachers({ page });
  },

  setItemsPerPage: (limit) => {
    set((state) => ({
      filters: { ...state.filters, limit, page: 1 },
    }));
    get().fetchTeachers({ limit, page: 1 });
  },
}));
