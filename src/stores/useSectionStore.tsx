import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Section {
  id: number;
  name: string;
  description: string;
  department_name: string;
  created_at: string;
}

interface SectionStore {
  // Data
  currentSection: Section | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSection: (departmentId: number, sectionId: number) => Promise<Section | null>;
  createSection: (departmentId: number, data: { name: string; description: string }) => Promise<void>;
  updateSection: (departmentId: number, sectionId: number, data: { name?: string; description?: string }) => Promise<void>;
  deleteSection: (departmentId: number, sectionId: number) => Promise<void>;
  
  // State management
  setCurrentSection: (section: Section | null) => void;
  clearError: () => void;
}

export const useSectionStore = create<SectionStore>((set) => ({
  // Initial state
  currentSection: null,
  isLoading: false,
  error: null,

  // Fetch single section
  fetchSection: async (departmentId: number, sectionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        message: string;
        data: Section;
      }>(`/admin/departments/${departmentId}/sections/${sectionId}`);

      if (response.data.success) {
        set({ currentSection: response.data.data, error: null });
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch section");
      }
    } catch (error: any) {
      console.error("Error fetching section:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch section details";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create section
  createSection: async (departmentId: number, data: { name: string; description: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
        data: Section;
      }>(`/admin/departments/${departmentId}/sections`, data);

      if (response.data.success) {
        set({ currentSection: response.data.data, error: null });
        toast.success("Section created successfully");
      } else {
        throw new Error(response.data.message || "Failed to create section");
      }
    } catch (error: any) {
      console.error("Error creating section:", error);
      const errorMessage = error.response?.data?.message || "Failed to create section";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update section
  updateSection: async (departmentId: number, sectionId: number, data: { name?: string; description?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch<{
        success: boolean;
        message: string;
        data: Section;
      }>(`/admin/departments/${departmentId}/sections/${sectionId}`, data);

      if (response.data.success) {
        set({ currentSection: response.data.data, error: null });
        toast.success("Section updated successfully");
      } else {
        throw new Error(response.data.message || "Failed to update section");
      }
    } catch (error: any) {
      console.error("Error updating section:", error);
      const errorMessage = error.response?.data?.message || "Failed to update section";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete section
  deleteSection: async (departmentId: number, sectionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete<{
        success: boolean;
        message: string;
      }>(`/admin/departments/${departmentId}/sections/${sectionId}`);

      if (response.data.success) {
        set({ currentSection: null, error: null });
        toast.success("Section deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete section");
      }
    } catch (error: any) {
      console.error("Error deleting section:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete section";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // State management
  setCurrentSection: (section) => {
    set({ currentSection: section });
  },

  clearError: () => {
    set({ error: null });
  },
}));