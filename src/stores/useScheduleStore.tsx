import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

interface Schedule {
    id: string;
    class_id: number;
    class_name: string;
    class_code: string;
    room_id: number;
    room_code: string;
    building: string;
    capacity: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    duration: number;
    is_recurring: boolean;
    is_active: boolean;
    teacher_name?: string;
    teacher_email?: string;
    subject_name?: string;
}

interface Room {
    id: number;
    room_code: string;
    building: string;
    capacity: number;
    is_active: boolean;
}

interface Class {
    id: number;
    section_name: string;
    subject_id: number;
    semester_id: number;
    name: string;
    code: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

interface Filters {
    search?: string;
    room?: string;
    class?: string;
    day_of_week?: string;
    sort_by: 'day_of_week' | 'start_time' | 'class_name' | 'room_code';
    sort_order: 'ASC' | 'DESC';
    page: number;
    limit: number;
}

interface ScheduleState {
    // Data
    schedules: Schedule[];
    allSchedules: Schedule[]; // Store all schedules for client-side filtering
    rooms: Room[];
    classes: Class[];
    meta: Meta | null;

    // UI State
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;

    // Filters
    filters: Filters;

    // Actions
    fetchSchedules: () => Promise<void>;
    fetchStudentSchedules: () => Promise<void>;
    fetchScheduleById: (id: string) => Promise<Schedule | null>;
    fetchRooms: () => Promise<void>;
    fetchClasses: () => Promise<void>;
    createSchedule: (data: any) => Promise<void>;
    updateSchedule: (id: string, data: any) => Promise<void>;
    deleteSchedule: (id: string) => Promise<void>;

    // Filter management
    setFilter: (key: keyof Filters, value: any) => void;
    resetFilters: () => void;

    // Pagination
    goToPage: (page: number) => void;
    setItemsPerPage: (limit: number) => void;

    // Apply filters
    applyFilters: () => void;
}

const initialFilters: Filters = {
    search: '',
    room: '',
    class: '',
    day_of_week: '',
    sort_by: 'day_of_week',
    sort_order: 'ASC',
    page: 1,
    limit: 10,
};

// Helper function to calculate duration
const calculateDuration = (startTime: string, endTime: string): number => {
    try {
        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);
        const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        return Math.round(diffInMinutes);
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 90; // Default duration
    }
};

// Helper function to transform schedule data
const transformScheduleData = (item: any): Schedule => ({
    id: item.id?.toString() || '',
    class_id: item.class_id,
    class_name: item.class?.section_name || '',
    class_code: item.class?.section_name || '',
    room_id: item.room_id,
    room_code: item.room?.room_code || '',
    building: item.room?.building || '',
    capacity: item.room?.capacity || 0,
    day_of_week: item.day_of_week,
    start_time: item.start_time,
    end_time: item.end_time,
    duration: calculateDuration(item.start_time, item.end_time),
    is_recurring: item.is_recurring,
    is_active: item.is_active,
    teacher_name: item.teacher_name,
    teacher_email: item.teacher_email,
    subject_name: item.subject_name,
});

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set, get) => ({
            // Initial state
            schedules: [],
            allSchedules: [], // All schedules for client-side filtering
            rooms: [],
            classes: [],
            meta: null,
            isLoading: false,
            isCreating: false,
            isUpdating: false,
            isDeleting: false,
            filters: initialFilters,

            // Fetch schedules (get all schedules from API)
            fetchSchedules: async () => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.get('/schedules');

                    console.log("Schedules API Response:", response.data);

                    let schedulesArray = [];

                    if (Array.isArray(response.data)) {
                        schedulesArray = response.data;
                    } else if (response.data.success && Array.isArray(response.data.data)) {
                        schedulesArray = response.data.data;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        schedulesArray = response.data.data;
                    } else {
                        console.warn('Unexpected API response structure:', response.data);
                        toast.error('Unexpected data format received');
                    }

                    // Transform all schedules
                    const transformedSchedules = schedulesArray.map(transformScheduleData);

                    set({
                        allSchedules: transformedSchedules,
                        schedules: transformedSchedules, // Initially show all
                        meta: {
                            page: 1,
                            limit: 10,
                            total: transformedSchedules.length,
                        },
                    });

                } catch (error: any) {
                    console.error('Error fetching schedules:', error);
                    toast.error(error.response?.data?.message || 'Failed to fetch schedules');
                    set({ schedules: [], allSchedules: [], meta: null });
                } finally {
                    set({ isLoading: false });
                }
            },

            // Fetch student schedules
            fetchStudentSchedules: async () => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.get('/schedules');

                    let schedulesArray = [];

                    if (Array.isArray(response.data)) {
                        schedulesArray = response.data;
                    } else if (response.data.success && Array.isArray(response.data.data)) {
                        schedulesArray = response.data.data;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        schedulesArray = response.data.data;
                    }

                    const transformedSchedules = schedulesArray.map(transformScheduleData);

                    set({
                        allSchedules: transformedSchedules,
                        schedules: transformedSchedules,
                        meta: {
                            page: 1,
                            limit: 10,
                            total: transformedSchedules.length,
                        },
                    });

                    setTimeout(() => get().applyFilters(), 0);
                } catch (error: any) {
                    console.error('Error fetching student schedules:', error);
                    toast.error(error.response?.data?.message || 'Failed to fetch your schedules');
                } finally {
                    set({ isLoading: false });
                }
            },

            // Apply client-side filters
            applyFilters: () => {
                const { allSchedules, filters } = get();

                if (!allSchedules.length) return;

                let filtered = [...allSchedules];

                // Search filter
                if (filters.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filtered = filtered.filter(schedule =>
                        schedule.class_name.toLowerCase().includes(searchTerm) ||
                        schedule.class_code.toLowerCase().includes(searchTerm) ||
                        schedule.room_code.toLowerCase().includes(searchTerm) ||
                        schedule.building.toLowerCase().includes(searchTerm) ||
                        (schedule.teacher_name && schedule.teacher_name.toLowerCase().includes(searchTerm)) ||
                        (schedule.subject_name && schedule.subject_name.toLowerCase().includes(searchTerm))
                    );
                }

                // Room filter
                if (filters.room) {
                    filtered = filtered.filter(schedule =>
                        schedule.room_id === parseInt(filters.room || '0')
                    );
                }

                // Class filter
                if (filters.class) {
                    filtered = filtered.filter(schedule =>
                        schedule.class_id === parseInt(filters.class || '0')
                    );
                }

                // Day filter
                if (filters.day_of_week) {
                    filtered = filtered.filter(schedule =>
                        schedule.day_of_week.toLowerCase() === filters.day_of_week?.toLowerCase()
                    );
                }

                // Sort
                filtered.sort((a, b) => {
                    const order = filters.sort_order === 'ASC' ? 1 : -1;

                    switch (filters.sort_by) {
                        case 'day_of_week':
                            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                            const dayA = days.indexOf(a.day_of_week.toLowerCase());
                            const dayB = days.indexOf(b.day_of_week.toLowerCase());
                            return (dayA - dayB) * order;

                        case 'start_time':
                            return (a.start_time.localeCompare(b.start_time)) * order;

                        case 'class_name':
                            return a.class_name.localeCompare(b.class_name) * order;

                        case 'room_code':
                            return a.room_code.localeCompare(b.room_code) * order;

                        default:
                            return 0;
                    }
                });

                // Apply pagination
                const startIndex = (filters.page - 1) * filters.limit;
                const endIndex = startIndex + filters.limit;
                const paginated = filtered.slice(startIndex, endIndex);

                set({
                    schedules: paginated,
                    meta: {
                        page: filters.page,
                        limit: filters.limit,
                        total: filtered.length,
                    },
                });
            },

            // Fetch single schedule by ID
            fetchScheduleById: async (id: string) => {
                try {
                    const response = await axiosInstance.get(`/schedules/${id}`);

                    console.log("Schedule detail response:", response.data);

                    // Handle different response structures
                    let scheduleData = null;

                    if (response.data.success && response.data.data) {
                        scheduleData = response.data.data;
                    } else if (response.data.data) {
                        scheduleData = response.data.data;
                    } else if (Array.isArray(response.data)) {
                        scheduleData = response.data[0];
                    } else {
                        scheduleData = response.data;
                    }

                    if (scheduleData) {
                        return transformScheduleData(scheduleData);
                    }

                    toast.error('Schedule not found');
                    return null;

                } catch (error: any) {
                    console.error('Error fetching schedule:', error);
                    toast.error(error.response?.data?.message || 'Failed to fetch schedule details');
                    return null;
                }
            },

            // Fetch classes
            fetchClasses: async () => {
                try {
                    const response = await axiosInstance.get('/classes');

                    console.log("Classes API Response:", response.data);

                    let classesArray = [];

                    if (Array.isArray(response.data)) {
                        classesArray = response.data;
                    } else if (response.data.success && Array.isArray(response.data.data)) {
                        classesArray = response.data.data;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        classesArray = response.data.data;
                    } else {
                        console.warn('Unexpected classes response structure:', response.data);
                    }

                    // Transform classes data if needed
                    const transformedClasses = classesArray.map((cls: any) => ({
                        id: cls.id,
                        section_name: cls.section_name || '',
                        subject_id: cls.subject_id,
                        semester_id: cls.semester_id,
                        name: cls.name || cls.section_name || '',
                        code: cls.code || cls.section_name || '',
                    }));

                    set({ classes: transformedClasses });

                } catch (error: any) {
                    console.error('Error fetching classes:', error);
                    toast.error('Failed to fetch classes');
                }
            },

            // Fetch rooms
            fetchRooms: async () => {
                try {
                    const response = await axiosInstance.get('/rooms');

                    console.log("Rooms API Response:", response.data);

                    let roomsArray = [];

                    if (Array.isArray(response.data)) {
                        roomsArray = response.data;
                    } else if (response.data.success && Array.isArray(response.data.data)) {
                        roomsArray = response.data.data;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        roomsArray = response.data.data;
                    } else {
                        console.warn('Unexpected rooms response structure:', response.data);
                    }

                    // Transform rooms data
                    const transformedRooms = roomsArray.map((room: any) => ({
                        id: room.id,
                        room_code: room.room_code || '',
                        building: room.building || '',
                        capacity: room.capacity || 0,
                        is_active: room.is_active || true,
                    }));

                    set({ rooms: transformedRooms });

                } catch (error: any) {
                    console.error('Error fetching rooms:', error);
                    toast.error('Failed to fetch rooms');
                }
            },

            // Create schedule
            createSchedule: async (data: any) => {
                set({ isCreating: true });
                try {
                    const response = await axiosInstance.post('/schedules', data);

                    if (response.data.success || response.status === 201 || response.status === 200) {
                        toast.success('Schedule created successfully');
                        // Refresh the list
                        await get().fetchSchedules();
                        // Re-apply filters
                        get().applyFilters();
                    } else {
                        throw new Error(response.data.message || 'Failed to create schedule');
                    }
                } catch (error: any) {
                    console.error('Error creating schedule:', error);
                    toast.error(error.response?.data?.message || 'Failed to create schedule');
                    throw error;
                } finally {
                    set({ isCreating: false });
                }
            },

            // Update schedule
            updateSchedule: async (id: string, data: any) => {
                set({ isUpdating: true });
                try {
                    const response = await axiosInstance.put(`/schedules/${id}`, data);

                    if (response.data.success || response.status === 200) {
                        toast.success('Schedule updated successfully');
                        // Refresh the list
                        await get().fetchSchedules();
                        // Re-apply filters
                        get().applyFilters();
                    } else {
                        throw new Error(response.data.message || 'Failed to update schedule');
                    }
                } catch (error: any) {
                    console.error('Error updating schedule:', error);
                    toast.error(error.response?.data?.message || 'Failed to update schedule');
                    throw error;
                } finally {
                    set({ isUpdating: false });
                }
            },

            // Delete schedule
            deleteSchedule: async (id: string) => {
                set({ isDeleting: true });
                try {
                    const response = await axiosInstance.delete(`/schedules/${id}`);

                    if (response.status === 204 || response.status === 200) {
                        toast.success('Schedule deleted successfully');
                        // Refresh the list
                        await get().fetchSchedules();
                        // Re-apply filters
                        get().applyFilters();
                    } else if (response.data.success) {
                        toast.success('Schedule deleted successfully');
                        // Refresh the list
                        await get().fetchSchedules();
                        // Re-apply filters
                        get().applyFilters();
                    } else {
                        throw new Error(response.data.message || 'Failed to delete schedule');
                    }
                } catch (error: any) {
                    console.error('Error deleting schedule:', error);
                    toast.error(error.response?.data?.message || 'Failed to delete schedule');
                    throw error;
                } finally {
                    set({ isDeleting: false });
                }
            },

            // Filter management
            setFilter: (key: keyof Filters, value: any) => {
                const { filters } = get();

                if (key === 'page' && filters.page === value) return;

                if (key === 'page') {
                    set({ filters: { ...filters, [key]: value } });
                    // Apply filters after setting page
                    setTimeout(() => get().applyFilters(), 0);
                } else {
                    set({ filters: { ...filters, [key]: value, page: 1 } });
                    // Apply filters after setting other filters
                    setTimeout(() => get().applyFilters(), 0);
                }
            },

            resetFilters: () => {
                set({ filters: initialFilters });
                // Apply filters after resetting
                setTimeout(() => get().applyFilters(), 0);
            },

            // Pagination
            goToPage: (page: number) => {
                get().setFilter('page', page);
            },

            setItemsPerPage: (limit: number) => {
                get().setFilter('limit', limit);
            },
        }),
        {
            name: 'schedule-storage',
            partialize: (state) => ({
                filters: state.filters,
            }),
        }
    )
);