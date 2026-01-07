import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  total_hours: number;  // Added this field
  credits: number;
  program_name: string;
  program_id: number;
  semester_names: string[];
}

interface Program {
  id: number;
  name: string;
}

interface Semester {
  id: number;
  name: string;
  semester_number: number;
  year_number: number;
  program_id: number;
}

interface Teacher {
  id: string;
  code: string;
  name: string;
  email: string;
}

interface FilterParams {
  program?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
}

interface SubjectsResponse {
  success: boolean;
  message: string;
  data: Subject[];
  data_setup: {
    programs: Program[];
    semesters: Semester[];
    teachers: Teacher[];
  };
  meta: MetaData;
}

interface SubjectState {
  // Data
  subjects: Subject[];
  programs: Program[];
  semesters: Semester[];
  teachers: Teacher[];
  meta: MetaData | null;

  // UI State
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Filters
  filters: FilterParams;

  // Actions
  fetchSubjects: (params?: Partial<FilterParams>) => Promise<void>;
  fetchSubjectById: (id: string) => Promise<Subject | null>;
  createSubject: (data: any) => Promise<void>;
  updateSubject: (id: string, data: any) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

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
  program: "",
  search: "",
  sort_by: "name",
  sort_order: "ASC",
  page: 1,
  limit: 10,
};

export const useSubjectStore = create<SubjectState>((set, get) => ({
  // Initial state
  subjects: [],
  programs: [],
  semesters: [],
  teachers: [],
  meta: null,

  isLoading: false,
  isFetching: false,
  error: null,

  filters: defaultFilters,

  // Fetch subjects with filters
  fetchSubjects: async (params?: Partial<FilterParams>) => {
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

      const response = await axiosInstance.get<SubjectsResponse>(
        `/admin/subjects?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          subjects: response.data.data,
          programs: response.data.data_setup.programs,
          semesters: response.data.data_setup.semesters,
          teachers: response.data.data_setup.teachers,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch subjects");
      }
    } catch (error: any) {
      console.error("Error fetching subjects:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load subjects";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  // Fetch single subject
  fetchSubjectById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Subject }>(
        `/admin/subjects/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching subject:", error);
      toast.error(error.response?.data?.message || "Failed to fetch subject");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create subject
  createSubject: async (data: any) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/admin/subjects", data);

      toast.success("Subject created successfully");
      await get().fetchSubjects();
    } catch (error: any) {
      console.error("Error creating subject:", error);
      toast.error(error.response?.data?.message || "Failed to create subject");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update subject
  updateSubject: async (id: string, data: any) => {
    set({ isLoading: true });
    try {
      await axiosInstance.patch(`/admin/subjects/${id}`, data);
      toast.success("Subject updated successfully");
      // Refresh the list
      await get().fetchSubjects();
    } catch (error: any) {
      console.error("Error updating subject:", error);
      toast.error(error.response?.data?.message || "Failed to update subject");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete subject
  deleteSubject: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/admin/subjects/${id}`);
      toast.success("Subject deleted successfully");
      // Refresh the list
      await get().fetchSubjects();
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to delete subject");
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
    get().fetchSubjects({ page });
  },

  setItemsPerPage: (limit) => {
    set((state) => ({
      filters: { ...state.filters, limit, page: 1 },
    }));
    get().fetchSubjects({ limit, page: 1 });
  },
}));