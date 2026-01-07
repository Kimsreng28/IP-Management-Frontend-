// stores/useProgramStore.tsx
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Department {
  id: number;
  name: string;
}

interface DegreeLevel {
  value: number;
  label: string;
}

interface Program {
  id: string;
  name: string;
  degree_lvl: number;
  duration: number;
  department_name: string;
  department_id: number;
  description?: string;
  created_at?: string;
  is_active?: boolean;
}

interface ProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
  data_setup: {
    departments: Department[];
    degree_levels: DegreeLevel[];
  };
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ProgramDetailResponse {
  success: boolean;
  message: string;
  data: Program;
}

interface FilterParams {
  search?: string;
  page?: number;
  limit?: number;
  department?: string;
  degree_lvl?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
  is_active?: string;
}

interface ProgramCreatePayload {
  name: string;
  description: string;
  degree_lvl: number;
  duration: number;
  department_id: number;
  is_active?: boolean;
}

interface ProgramState {
  // Data
  programs: Program[];
  departments: Department[];
  degreeLevels: DegreeLevel[];
  meta: {
    page: number;
    limit: number;
    total: number;
  } | null;

  // UI State
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Filters
  filters: FilterParams;

  // Actions
  fetchPrograms: (params?: Partial<FilterParams>) => Promise<void>;
  fetchProgramById: (id: string) => Promise<Program | null>;
  createProgram: (data: ProgramCreatePayload) => Promise<void>;
  updateProgram: (
    id: string,
    data: Partial<ProgramCreatePayload>
  ) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  toggleProgramStatus: (id: string, isActive: boolean) => Promise<void>;

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
  search: "",
  page: 1,
  limit: 10,
  sort_by: "name",
  sort_order: "ASC",
};

export const useProgramStore = create<ProgramState>((set, get) => ({
  // Initial state
  programs: [],
  departments: [],
  degreeLevels: [],
  meta: null,

  isLoading: false,
  isFetching: false,
  error: null,

  filters: defaultFilters,

  // Fetch programs with filters
  fetchPrograms: async (params?: Partial<FilterParams>) => {
    const currentFilters = get().filters;
    const mergedFilters = { ...currentFilters, ...params };

    // Update state
    set({
      isFetching: true,
      filters: mergedFilters, // Update filters in the same set call
    });

    try {
      // Build query params using mergedFilters (not state filters)
      const queryParams = new URLSearchParams();

      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      console.log("API call with:", queryParams.toString());

      const response = await axiosInstance.get<ProgramsResponse>(
        `/admin/programs?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          programs: response.data.data,
          departments: response.data.data_setup.departments,
          degreeLevels: response.data.data_setup.degree_levels,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch programs");
      }
    } catch (error: any) {
      console.error("Error fetching programs:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load programs";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  // Fetch single program
  fetchProgramById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<ProgramDetailResponse>(
        `/admin/programs/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching program:", error);
      toast.error(error.response?.data?.message || "Failed to fetch program");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create program
  createProgram: async (data: ProgramCreatePayload) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post<ProgramDetailResponse>("/admin/programs", data);

      toast.success("Program created successfully");

      // Refresh the programs list
      await get().fetchPrograms();
    } catch (error: any) {
      console.error("Error creating program:", error);
      toast.error(error.response?.data?.message || "Failed to create program");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update program
  updateProgram: async (id: string, data: Partial<ProgramCreatePayload>) => {
    set({ isLoading: true });
    try {
      await axiosInstance.patch(`/admin/programs/${id}`, data);
      toast.success("Program updated successfully");
      await get().fetchPrograms();
    } catch (error: any) {
      console.error("Error updating program:", error);
      toast.error(error.response?.data?.message || "Failed to update program");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete program
  deleteProgram: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/admin/programs/${id}`);
      toast.success("Program deleted successfully");
      await get().fetchPrograms();
    } catch (error: any) {
      console.error("Error deleting program:", error);
      toast.error(error.response?.data?.message || "Failed to delete program");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle program active status
  toggleProgramStatus: async (id: string, isActive: boolean) => {
    set({ isLoading: true });
    try {
      await axiosInstance.patch(`/admin/programs/${id}/status`, {
        is_active: isActive,
      });
      toast.success(
        `Program ${isActive ? "activated" : "deactivated"} successfully`
      );
      await get().fetchPrograms();
    } catch (error: any) {
      console.error("Error toggling program status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update program status"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Filter management
  setFilter: (key, value) => {
    let processedValue = value;

    // Convert degree_lvl from string to number if it's being set
    if (key === "degree_lvl" && value !== undefined) {
      processedValue = Number(value);
      // Handle NaN case
      if (isNaN(processedValue as number)) {
        processedValue = undefined;
      }
    }

    set((state) => ({
      filters: {
        ...state.filters,
        [key]: processedValue,
        page: 1,
      },
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
    get().fetchPrograms({ page });
  },

  setItemsPerPage: (limit) => {
    set((state) => ({
      filters: { ...state.filters, limit, page: 1 },
    }));
    get().fetchPrograms({ limit, page: 1 });
  },
}));
