
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Section {
  id: number;
  name: string;
  created_at: string;
}

interface Department {
  id: number;
  name: string;
  description: string;
  hod_name: string;
  hod_user_id: string;
  created_at: string;
  sections?: Section[];
}

interface HeadOfDepartment {
  id: string;
  name: string;
}

interface DepartmentDetailResponse {
  success: boolean;
  message: string;
  data: Department;
}

interface DepartmentsResponse {
  success: boolean;
  message: string;
  data: Department[];
  data_setup: {
    head_of_departments: HeadOfDepartment[];
  };
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface FilterParams {
  search?: string;
  page?: number;
  limit?: number;
}

// Separate interface for creating sections
interface SectionCreateData {
  name: string;
  description: string;
}

// Separate interface for creating department with sections
interface DepartmentCreatePayload {
  name: string;
  description: string;
  hod_user_id: string;
  sections?: SectionCreateData[];
}

interface DepartmentState {
  // Data
  departments: Department[];
  headOfDepartments: HeadOfDepartment[];
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
  fetchDepartments: (params?: Partial<FilterParams>) => Promise<void>;
  fetchDepartmentById: (id: number) => Promise<Department | null>;
  createDepartment: (data: DepartmentCreatePayload) => Promise<void>;
  updateDepartment: (id: number, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;

  // Filter management
  setFilter: (key: keyof FilterParams, value: string | number | undefined) => void;
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
};

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  // Initial state
  departments: [],
  headOfDepartments: [],
  meta: null,

  isLoading: false,
  isFetching: false,
  error: null,

  filters: defaultFilters,

  // Fetch departments with filters
  fetchDepartments: async (params?: Partial<FilterParams>) => {
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

      const response = await axiosInstance.get<DepartmentsResponse>(
        `/admin/departments?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          departments: response.data.data,
          headOfDepartments: response.data.data_setup.head_of_departments,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch departments");
      }
    } catch (error: any) {
      console.error("Error fetching departments:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load departments";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  // Fetch single department
  fetchDepartmentById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Department }>(
        `/admin/departments/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching department:", error);
      toast.error(error.response?.data?.message || "Failed to fetch department");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create department (updated to handle sections)
  createDepartment: async (data: DepartmentCreatePayload) => {
    set({ isLoading: true });
    try {
      // Extract sections if present
      const { sections, ...departmentData } = data;
      
      // Create department first
      const response = await axiosInstance.post<DepartmentDetailResponse>(
        "/admin/departments", 
        departmentData
      );
      
      toast.success("Department created successfully");
      
      // If there are sections, create them
      if (sections && sections.length > 0 && response.data.data.id) {
        const departmentId = response.data.data.id;
        
        // Create sections one by one
        for (const section of sections) {
          try {
            await axiosInstance.post(
              `/admin/departments/${departmentId}/sections`,
              section
            );
          } catch (sectionError: any) {
            console.error("Error creating section:", sectionError);
            toast.error(`Failed to create section: ${section.name}`);
          }
        }
      }
      
      // Refresh the departments list
      await get().fetchDepartments();
    } catch (error: any) {
      console.error("Error creating department:", error);
      toast.error(error.response?.data?.message || "Failed to create department");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update department
  updateDepartment: async (id: number, data: Partial<Department>) => {
    set({ isLoading: true });
    try {
      await axiosInstance.patch(`/admin/departments/${id}`, data);
      toast.success("Department updated successfully");
      await get().fetchDepartments();
    } catch (error: any) {
      console.error("Error updating department:", error);
      toast.error(error.response?.data?.message || "Failed to update department");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete department
  deleteDepartment: async (id: number) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/admin/departments/${id}`);
      toast.success("Department deleted successfully");
      await get().fetchDepartments();
    } catch (error: any) {
      console.error("Error deleting department:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to delete department");
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
    get().fetchDepartments({ page });
  },

  setItemsPerPage: (limit) => {
    set((state) => ({
      filters: { ...state.filters, limit, page: 1 },
    }));
    get().fetchDepartments({ limit, page: 1 });
  },
}));
