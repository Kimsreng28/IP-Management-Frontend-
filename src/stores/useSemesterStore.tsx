// stores/useSemesterStore.tsx
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Subject {
    id: number;
    code: string;
    name: string;
    credits: number;
}

interface Semester {
    id: string;
    name: string;
    semester_number: number;
    year_number: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    program_id: number;
    program_name: string;
    academic_year_id: number;
    academic_year_name: string;
    subjects_count: number;
}

interface SemesterDetail extends Omit<Semester, 'subjects_count'> {
    subjects: Subject[];
}

interface AcademicYear {
    id: number;
    name: string;
    start_year?: number;
    end_year?: number;
}

interface DataSetup {
    programs: Array<{ id: number; name: string }>;
    academic_years: AcademicYear[];
    subjects: Subject[];
}

interface SemestersResponse {
    success: boolean;
    message: string;
    data: Semester[];
    data_setup: DataSetup;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

interface SemesterDetailResponse {
    success: boolean;
    message: string;
    data: SemesterDetail;
}

interface CreateSemesterPayload {
    name: string;
    semester_number: number;
    year_number: number;
    start_date: string;
    end_date: string;
    academic_year_id: number;
    subject_ids?: number[];
    is_active?: boolean;
}

interface UpdateSemesterPayload extends Partial<CreateSemesterPayload> { }

interface SemesterState {
    // Data
    semesters: Semester[];
    dataSetup: DataSetup | null;
    meta: {
        page: number;
        limit: number;
        total: number;
    } | null;

    // UI State
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;

    // Actions
    fetchSemestersByProgram: (programId: number) => Promise<void>;
    fetchSemesterById: (programId: number, semesterId: string) => Promise<SemesterDetail | null>;
    createSemester: (programId: number, data: CreateSemesterPayload) => Promise<void>;
    updateSemester: (programId: number, semesterId: string, data: UpdateSemesterPayload) => Promise<void>;
    deleteSemester: (programId: number, semesterId: string) => Promise<void>;
}

export const useSemesterStore = create<SemesterState>((set, get) => ({
    // Initial state
    semesters: [],
    dataSetup: null,
    meta: null,
    isLoading: false,
    isFetching: false,
    error: null,

    // Fetch semesters by program
    fetchSemestersByProgram: async (programId: number) => {
        set({ isFetching: true, error: null });

        try {
            const response = await axiosInstance.get<SemestersResponse>(
                `/admin/programs/${programId}/semesters`
            );

            if (response.data.success) {
                set({
                    semesters: response.data.data,
                    dataSetup: response.data.data_setup,
                    meta: response.data.meta,
                    error: null,
                });
            } else {
                throw new Error(response.data.message || "Failed to fetch semesters");
            }
        } catch (error: any) {
            console.error("Error fetching semesters:", error);
            const errorMessage = error.response?.data?.message || "Failed to load semesters";
            set({ error: errorMessage });
            toast.error(errorMessage);
        } finally {
            set({ isFetching: false });
        }
    },

    // Fetch single semester
    fetchSemesterById: async (programId: number, semesterId: string) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get<SemesterDetailResponse>(
                `/admin/programs/${programId}/semesters/${semesterId}`
            );

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            console.error("Error fetching semester:", error);
            const errorMessage = error.response?.data?.message || "Failed to fetch semester";
            toast.error(errorMessage);
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    // Create semester
    createSemester: async (programId: number, data: CreateSemesterPayload) => {
        set({ isLoading: true });
        try {
            await axiosInstance.post<SemesterDetailResponse>(
                `/admin/programs/${programId}/semesters`,
                data
            );

            toast.success("Semester created successfully");

            // Refresh the semesters list
            await get().fetchSemestersByProgram(programId);
        } catch (error: any) {
            console.error("Error creating semester:", error);
            toast.error(error.response?.data?.message || "Failed to create semester");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Update semester
    updateSemester: async (programId: number, semesterId: string, data: UpdateSemesterPayload) => {
        set({ isLoading: true });
        try {
            await axiosInstance.patch(
                `/admin/programs/${programId}/semesters/${semesterId}`,
                data
            );
            toast.success("Semester updated successfully");
            await get().fetchSemestersByProgram(programId);
        } catch (error: any) {
            console.error("Error updating semester:", error);
            toast.error(error.response?.data?.message || "Failed to update semester");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Delete semester
    deleteSemester: async (programId: number, semesterId: string) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/admin/programs/${programId}/semesters/${semesterId}`);
            toast.success("Semester deleted successfully");
            await get().fetchSemestersByProgram(programId);
        } catch (error: any) {
            console.error("Error deleting semester:", error);
            toast.error(error.response?.data?.message || "Failed to delete semester");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));