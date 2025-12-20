import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Hod {
  id: string;
  hod_id: string;
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
  sort_by?: "dob" | "name_en" | "name_kh" | "hod_id";
  sort_order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
}

interface HodsResponse {
  success: boolean;
  message: string;
  data: Hod[];
  data_setup: {
    departments: Department[];
  };
  meta: MetaData;
}

interface HodState {
  // Data
  hods: Hod[];
  departments: Department[];
  meta: MetaData | null;

  // UI State
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Filters
  filters: FilterParams;

  // Actions
  fetchHods: (params?: Partial<FilterParams>) => Promise<void>;
  fetchHodById: (id: string) => Promise<Hod | null>;
  createHod: (data: FormData) => Promise<void>; // Add this
  updateHod: (
    id: string,
    data: Partial<Hod> | FormData
  ) => Promise<void>; // Add this for future use
  deleteHod: (id: string) => Promise<void>; // Add this for future use

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
  sort_by: "hod_id",
  sort_order: "ASC",
  page: 1,
  limit: 10,
};

export const useHodStore = create<HodState>((set, get) => ({
  // Initial state
  hods: [],
  departments: [],
  meta: null,

  isLoading: false,
  isFetching: false,
  error: null,

  filters: defaultFilters,

  // Fetch hods with filters
  fetchHods: async (params?: Partial<FilterParams>) => {
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

      const response = await axiosInstance.get<HodsResponse>(
        `/admin/hods?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          hods: response.data.data,
          departments: response.data.data_setup.departments,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch hods");
      }
    } catch (error: any) {
      console.error("Error fetching hods:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load hods";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  // Fetch single hod
  fetchHodById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Hod }>(
        `/admin/hods/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching hod:", error);
      toast.error(error.response?.data?.message || "Failed to fetch hod");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create hod
  createHod: async (data: FormData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/admin/hods", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Hod created successfully");
      await get().fetchHods();
    } catch (error: any) {
      console.error("Error creating hod:", error);
      toast.error(error.response?.data?.message || "Failed to create hod");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update hod (for future use)
  updateHod: async (id: string, data: Partial<Hod> | FormData) => {
    set({ isLoading: true });
    try {
      if (data instanceof FormData) {
        // Handle FormData (for updates with image)
        await axiosInstance.patch(`/admin/hods/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Handle regular JSON data
        await axiosInstance.patch(`/admin/hods/${id}`, data);
      }
      toast.success("Hod updated successfully");
      // Refresh the list
      await get().fetchHods();
    } catch (error: any) {
      console.error("Error updating hod:", error);
      toast.error(error.response?.data?.message || "Failed to update hod");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete hod (for future use)
  deleteHod: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/admin/hods/${id}`);
      toast.success("Hod deleted successfully");
      // Refresh the list
      await get().fetchHods();
    } catch (error: any) {
      console.error("Error deleting hod:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to delete hod");
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
    get().fetchHods({ page });
  },

  setItemsPerPage: (limit) => {
    set((state) => ({
      filters: { ...state.filters, limit, page: 1 },
    }));
    get().fetchHods({ limit, page: 1 });
  },
}));
