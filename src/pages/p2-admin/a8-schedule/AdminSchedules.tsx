"use client";

import { useEffect, useState } from "react";
import {
    Eye,
    Edit2,
    Trash2,
    Plus,
    Search,
    ArrowUp,
    ArrowDown,
    Calendar,
    Clock,
    Building2,
    Users,
    BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

import { useScheduleStore } from "../../../stores/useScheduleStore";
import AdminCreateSchedule from "./AdminCreateSchedule";
import AdminUpdateSchedule from "./AdminUpdateSchedule";
import AdminScheduleDetail from "./AdminScheduleDetail";

export default function AdminSchedules() {
    const {
        // Data
        schedules,
        rooms,
        classes,
        meta,

        // UI State
        isLoading,

        // Filters
        filters,

        // Actions
        fetchSchedules,
        fetchRooms,
        fetchClasses,
        deleteSchedule,

        // Filter management
        setFilter,
        resetFilters,

        // Pagination
        goToPage,
        setItemsPerPage,

        // Client-side filtering
        applyFilters,
    } = useScheduleStore();

    // State variables
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

    // Handlers
    const handleEditSchedule = (scheduleId: string) => {
        setEditingScheduleId(scheduleId);
        setUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setUpdateModalOpen(false);
        setEditingScheduleId(null);
    };

    const handleViewSchedule = (scheduleId: string) => {
        setSelectedScheduleId(scheduleId);
        setViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedScheduleId(null);
    };

    const handleDeleteSchedule = async (
        id: string,
        className: string,
        roomCode: string,
        dayOfWeek: string
    ) => {
        const message = `Are you sure you want to delete this schedule?\n\n${className} in ${roomCode} (${dayOfWeek})`;

        if (confirm(message)) {
            try {
                await deleteSchedule(id);
            } catch (error) {
                console.error("Failed to delete schedule:", error);
                toast.error("Failed to delete schedule");
            }
        }
    };

    const handleClearFilters = () => {
        resetFilters();
    };

    // Initial fetch
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchSchedules(),
                fetchRooms(),
                fetchClasses()
            ]);
            // Apply filters after all data is loaded
            applyFilters();
        };

        loadData();
    }, []);

    // Debug useEffect
    useEffect(() => {
        console.log("Current filters:", filters);
        console.log("Schedules count:", schedules.length);
        console.log("Meta:", meta);
        console.log("Rooms count:", rooms.length);
        console.log("Classes count:", classes.length);
    }, [filters, schedules, meta, rooms, classes]);

    // Filter handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter("search", e.target.value);
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter("room", e.target.value);
    };

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter("class", e.target.value);
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter("day_of_week", e.target.value);
    };

    // Sorting handler
    const handleSort = (column: "day_of_week" | "start_time" | "class_name" | "room_code") => {
        const currentSortBy = filters.sort_by;
        const currentSortOrder = filters.sort_order;

        if (currentSortBy === column) {
            setFilter("sort_order", currentSortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            setFilter("sort_by", column);
            setFilter("sort_order", "ASC");
        }
    };

    // Format day for display
    const formatDay = (day: string) => {
        return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    };

    // Format time for display
    const formatTime = (time: string) => {
        return time.substring(0, 5); // Extract HH:mm from HH:mm:ss
    };

    // Get day badge color
    const getDayBadgeColor = (day: string) => {
        const colors: Record<string, string> = {
            monday: "bg-blue-100 text-blue-800",
            tuesday: "bg-green-100 text-green-800",
            wednesday: "bg-yellow-100 text-yellow-800",
            thursday: "bg-purple-100 text-purple-800",
            friday: "bg-pink-100 text-pink-800",
            saturday: "bg-indigo-100 text-indigo-800",
            sunday: "bg-red-100 text-red-800",
        };
        return colors[day.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    // Skeleton row
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {[...Array(6)].map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
            ))}
        </tr>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Filters Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by class, room, teacher, or subject..."
                            value={filters.search || ""}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E]
                text-base placeholder-gray-500 transition-colors"
                        />
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="
                flex items-center justify-center gap-2
                px-6 py-3
                bg-[#131C2E] text-white font-medium 
                rounded-lg
                hover:bg-[#1B2742]
                active:bg-[#0E1524]
                transition-colors 
                shadow-sm
              "
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Schedule</span>
                        </button>
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Room Filter */}
                    <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 z-10" />
                        <select
                            value={filters.room || ""}
                            onChange={handleRoomChange}
                            className="
                pl-10 pr-4 py-2.5
                border border-gray-300 rounded-lg
                bg-gray-50
                hover:border-gray-400
                focus:ring-2 focus:ring-[#131C2E]
                focus:border-[#131C2E]
                cursor-pointer
                outline-none
                text-sm
                transition-colors
                min-w-[180px]
                appearance-none
              "
                            disabled={rooms.length === 0}
                        >
                            <option value="">All Rooms</option>
                            {rooms.length === 0 ? (
                                <option value="" disabled>Loading rooms...</option>
                            ) : (
                                rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.room_code || `Room ${room.id}`} - {room.building || 'Building'}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Class Filter */}
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 z-10" />
                        <select
                            value={filters.class || ""}
                            onChange={handleClassChange}
                            className="
                pl-10 pr-4 py-2.5
                border border-gray-300 rounded-lg
                bg-gray-50
                hover:border-gray-400
                focus:ring-2 focus:ring-[#131C2E]
                focus:border-[#131C2E]
                cursor-pointer
                outline-none
                text-sm
                transition-colors
                min-w-[180px]
                appearance-none
              "
                            disabled={classes.length === 0}
                        >
                            <option value="">All Classes</option>
                            {classes.length === 0 ? (
                                <option value="" disabled>Loading classes...</option>
                            ) : (
                                classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.section_name || cls.name || `Class ${cls.id}`} - {cls.code || ''}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Day Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 z-10" />
                        <select
                            value={filters.day_of_week || ""}
                            onChange={handleDayChange}
                            className="
                pl-10 pr-4 py-2.5
                border border-gray-300 rounded-lg
                bg-gray-50
                hover:border-gray-400
                focus:ring-2 focus:ring-[#131C2E]
                focus:border-[#131C2E]
                cursor-pointer
                outline-none
                text-sm
                transition-colors
                min-w-[150px]
                appearance-none
              "
                        >
                            <option value="">All Days</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </div>

                    {/* Push Clear button to the end */}
                    <div className="flex-1" />

                    <button
                        onClick={handleClearFilters}
                        className="
              px-4 py-2.5
              text-[#131C2E]
              bg-transparent
              rounded-lg
              hover:bg-gray-100
              active:bg-gray-200
              transition-colors
              text-sm
              font-medium
            "
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {/* Class Name */}
                            <th
                                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("class_name")}
                            >
                                <div className="flex items-center gap-1">
                                    Class
                                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {filters.sort_by === "class_name" &&
                                            (filters.sort_order === "ASC" ? (
                                                <ArrowUp size={14} className="text-gray-700" />
                                            ) : (
                                                <ArrowDown size={14} className="text-gray-700" />
                                            ))}
                                    </span>
                                </div>
                            </th>

                            {/* Room */}
                            <th
                                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("room_code")}
                            >
                                <div className="flex items-center gap-1">
                                    Room
                                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {filters.sort_by === "room_code" &&
                                            (filters.sort_order === "ASC" ? (
                                                <ArrowUp size={14} className="text-gray-700" />
                                            ) : (
                                                <ArrowDown size={14} className="text-gray-700" />
                                            ))}
                                    </span>
                                </div>
                            </th>

                            {/* Day */}
                            <th
                                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("day_of_week")}
                            >
                                <div className="flex items-center gap-1">
                                    Day
                                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {filters.sort_by === "day_of_week" &&
                                            (filters.sort_order === "ASC" ? (
                                                <ArrowUp size={14} className="text-gray-700" />
                                            ) : (
                                                <ArrowDown size={14} className="text-gray-700" />
                                            ))}
                                    </span>
                                </div>
                            </th>

                            {/* Time */}
                            <th
                                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("start_time")}
                            >
                                <div className="flex items-center gap-1">
                                    Time
                                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {filters.sort_by === "start_time" &&
                                            (filters.sort_order === "ASC" ? (
                                                <ArrowUp size={14} className="text-gray-700" />
                                            ) : (
                                                <ArrowDown size={14} className="text-gray-700" />
                                            ))}
                                    </span>
                                </div>
                            </th>

                            {/* Duration */}
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Duration
                            </th>

                            {/* Actions */}
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            // Show skeleton rows during initial load
                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : schedules.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Calendar className="w-12 h-12 text-gray-400" />
                                        <p className="text-gray-600">No schedules found</p>
                                        <p className="text-sm text-gray-500">
                                            Try adjusting your filters or create a new schedule
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // Real data
                            schedules.map((schedule) => (
                                <tr
                                    key={schedule.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Class */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {schedule.class_name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {schedule.class_code}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Room */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {schedule.room_code}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {schedule.building}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Day */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDayBadgeColor(
                                                schedule.day_of_week
                                            )}`}
                                        >
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {formatDay(schedule.day_of_week)}
                                        </span>
                                    </td>

                                    {/* Time */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Duration */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">
                                            {schedule.duration} min
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewSchedule(schedule.id)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleEditSchedule(schedule.id)}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit schedule"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteSchedule(
                                                        schedule.id,
                                                        schedule.class_name,
                                                        schedule.room_code,
                                                        schedule.day_of_week
                                                    )
                                                }
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete schedule"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {/* View Schedule Modal */}
            {selectedScheduleId && (
                <AdminScheduleDetail
                    scheduleId={selectedScheduleId}
                    isOpen={viewModalOpen}
                    onClose={handleCloseViewModal}
                />
            )}

            {/* Create Schedule Modal */}
            <AdminCreateSchedule
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={() => {
                    fetchSchedules();
                    setCreateModalOpen(false);
                }}
            />

            {/* Update Schedule Modal */}
            {editingScheduleId && (
                <AdminUpdateSchedule
                    scheduleId={editingScheduleId}
                    isOpen={updateModalOpen}
                    onClose={handleCloseUpdateModal}
                    onSuccess={() => {
                        fetchSchedules();
                    }}
                />
            )}

            {/* Pagination */}
            {meta && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4">
                    {/* Left: items per page and total */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>Showing</span>
                        <select
                            value={filters.limit || 10}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="
                px-3 py-1
                border border-gray-300 rounded-lg
                bg-white
                focus:ring-2 focus:ring-[#131C2E]
                focus:border-[#131C2E]
                outline-none
                cursor-pointer
              "
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>of {meta.total} schedules</span>
                    </div>

                    {/* Right: pagination controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(Math.max(1, (meta.page || 1) - 1))}
                            disabled={meta.page === 1}
                            className="
                px-3 py-1.5
                text-[#131C2E]
                bg-white
                border border-gray-300
                rounded-lg
                hover:bg-gray-100
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
                text-sm
              "
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {/* Generate page numbers */}
                            {Array.from(
                                { length: Math.min(5, Math.ceil(meta.total / meta.limit)) },
                                (_, i) => i + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`w-9 h-9 rounded-lg font-medium transition-colors text-sm ${meta.page === page
                                        ? "bg-[#131C2E] text-white"
                                        : "text-[#131C2E] bg-white border border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {Math.ceil(meta.total / meta.limit) > 5 && (
                                <>
                                    <span className="flex items-center px-2 text-gray-500">
                                        ...
                                    </span>
                                    <button
                                        onClick={() => goToPage(Math.ceil(meta.total / meta.limit))}
                                        className={`w-9 h-9 rounded-lg font-medium transition-colors text-sm ${meta.page === Math.ceil(meta.total / meta.limit)
                                            ? "bg-[#131C2E] text-white"
                                            : "text-[#131C2E] bg-white border border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {Math.ceil(meta.total / meta.limit)}
                                    </button>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => goToPage((meta.page || 1) + 1)}
                            disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                            className="
                px-3 py-1.5
                text-[#131C2E]
                bg-white
                border border-gray-300
                rounded-lg
                hover:bg-gray-100
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
                text-sm
              "
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}