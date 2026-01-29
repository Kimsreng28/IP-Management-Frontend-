import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Student {
  id: string;
  student_id: string;
  name_kh: string;
  name_en: string;
  dob: string;
  gender: "Male" | "Female";
  department: string;
  section: string;
  program: string;
  grade?: string;
  student_year?: number;
  academic_year?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

interface AcademicYear {
  id: number;
  name: string;
}
interface Department {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
  department_id: number;
}

interface Program {
  id: number;
  name: string;
  department_id: number;
}

interface FilterParams {
  academic_year?: string;
  department?: string;
  section?: string;
  program?: string;
  gender?: string;
  search?: string;
  sort_by?: "dob" | "name_en" | "name_kh" | "student_id";
  sort_order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
}

interface StudentsResponse {
  success: boolean;
  message: string;
  data: Student[];
  data_setup: {
    departments: Department[];
    sections: Section[];
    programs: Program[];
    academic_years: AcademicYear[];
  };
  meta: MetaData;
}

interface StudentState {
  // Data
  students: Student[];
  departments: Department[];
  sections: Section[];
  programs: Program[];
  academic_years: AcademicYear[];
  meta: MetaData | null;

  // UI State
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Filters
  filters: FilterParams;
  selectedStudents: string[];

  // Actions
  fetchStudents: (params?: Partial<FilterParams>) => Promise<void>;
  fetchStudentById: (id: string) => Promise<Student | null>;
  fetchStudentsForHod: (params?: Partial<FilterParams>) => Promise<void>;
  fetchStudentByIdForHod: (id: string) => Promise<Student | null>;
  fetchStudentsForTeacher: (params?: Partial<FilterParams>) => Promise<void>;
  fetchStudentByIdForTeacher: (id: string) => Promise<Student | null>;
  createStudent: (data: FormData) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student> | FormData) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  deleteMultipleStudents: (ids: string[]) => Promise<void>;

  // Filter management
  setFilter: (
    key: keyof FilterParams,
    value: string | number | undefined
  ) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  resetFilters: () => void;

  // Selection
  selectStudent: (id: string) => void;
  deselectStudent: (id: string) => void;
  selectAllStudents: () => void;
  deselectAllStudents: () => void;
  toggleStudentSelection: (id: string) => void;

  // Pagination
  goToPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
}

const defaultFilters: FilterParams = {
  academic_year: "",
  department: "",
  section: "",
  program: "",
  gender: "",
  search: "",
  sort_by: "student_id",
  sort_order: "ASC",
  page: 1,
  limit: 10,
};

export const useStudentStore = create<StudentState>((set, get) => ({
  // Initial state
  students: [],
  departments: [],
  sections: [],
  programs: [],
  academic_years: [],
  meta: null,

  isLoading: false,
  isFetching: false,
  error: null,

  filters: defaultFilters,
  selectedStudents: [],

  // Fetch students with filters
  fetchStudents: async (params?: Partial<FilterParams>) => {
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

      const response = await axiosInstance.get<StudentsResponse>(
        `/admin/students?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          students: response.data.data,
          departments: response.data.data_setup.departments,
          sections: response.data.data_setup.sections,
          programs: response.data.data_setup.programs,
          academic_years: response.data.data_setup.academic_years,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch students");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load students";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },
  fetchStudentsForHod: async (params?: Partial<FilterParams>) => {
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

      const response = await axiosInstance.get<StudentsResponse>(
        `/hod/students?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          students: response.data.data,
          departments: response.data.data_setup.departments,
          sections: response.data.data_setup.sections,
          programs: response.data.data_setup.programs,
          academic_years: response.data.data_setup.academic_years,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch students");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load students";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },
  fetchStudentsForTeacher: async (params?: Partial<FilterParams>) => {
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

      const response = await axiosInstance.get<StudentsResponse>(
        `/teacher/students?${queryParams.toString()}`
      );

      if (response.data.success) {
        set({
          students: response.data.data,
          departments: response.data.data_setup.departments,
          sections: response.data.data_setup.sections,
          programs: response.data.data_setup.programs,
          academic_years: response.data.data_setup.academic_years,
          meta: response.data.meta,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch students");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load students";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  // Fetch single student
  fetchStudentById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Student }>(
        `/admin/students/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching student:", error);
      toast.error(error.response?.data?.message || "Failed to fetch student");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchStudentByIdForHod: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Student }>(
        `/hod/students/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching student:", error);
      toast.error(error.response?.data?.message || "Failed to fetch student");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchStudentByIdForTeacher: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<{ data: Student }>(
        `/teacher/students/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching student:", error);
      toast.error(error.response?.data?.message || "Failed to fetch student");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create student
  createStudent: async (data: FormData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/admin/students", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Student created successfully");
      await get().fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create student");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },


  // Update student
  updateStudent: async (id: string, data: Partial<Student> | FormData) => {
    set({ isLoading: true });
    try {
      if (data instanceof FormData) {
        // Handle FormData (for updates with image)
        await axiosInstance.patch(`/admin/students/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Handle regular JSON data
        await axiosInstance.patch(`/admin/students/${id}`, data);
      }
      toast.success("Student updated successfully");
      // Refresh the list
      await get().fetchStudents();
    } catch (error: any) {
      console.error("Error updating student:", error);
      toast.error(error.response?.data?.message || "Failed to update student");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete student
  deleteStudent: async (id: string) => {
    set({ isLoading: true });
    try {
      console.log(`Making DELETE request to: /admin/students/${id}`);
      const response = await axiosInstance.delete(`/admin/students/${id}`);
      console.log("Delete response:", response);
      toast.success("Student deleted successfully");
      // Remove from selected students
      set((state) => ({
        selectedStudents: state.selectedStudents.filter((sid) => sid !== id),
      }));
      // Refresh the list
      await get().fetchStudents();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to delete student");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete multiple students
  deleteMultipleStudents: async (ids: string[]) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete("/admin/students/bulk", { data: { ids } });
      toast.success(`${ids.length} student(s) deleted successfully`);
      // Clear selected students
      set({ selectedStudents: [] });
      // Refresh the list
      await get().fetchStudents();
    } catch (error: any) {
      console.error("Error deleting students:", error);
      toast.error(error.response?.data?.message || "Failed to delete students");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Filter management
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 }, // Reset to page 1 when filter changes
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

  selectStudent: (id) => {
    set((state) => ({
      selectedStudents: [...state.selectedStudents, id],
    }));
  },

  deselectStudent: (id) => {
    set((state) => ({
      selectedStudents: state.selectedStudents.filter((sid) => sid !== id),
    }));
  },

  selectAllStudents: () => {
    set((state) => ({
      selectedStudents: state.students.map((student) => student.id),
    }));
  },

  deselectAllStudents: () => {
    set({ selectedStudents: [] });
  },

  toggleStudentSelection: (id) => {
    set((state) => {
      const isSelected = state.selectedStudents.includes(id);
      if (isSelected) {
        return {
          selectedStudents: state.selectedStudents.filter((sid) => sid !== id),
        };
      } else {
        return {
          selectedStudents: [...state.selectedStudents, id],
        };
      }
    });
  },

  // Pagination
  goToPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    get().fetchStudents({ page });
  },

  setItemsPerPage: (limit) => {
    set((state) => ({
      filters: { ...state.filters, limit, page: 1 },
    }));
    get().fetchStudents({ limit, page: 1 });
  },
}));
