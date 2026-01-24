"use client";

import { useState, useRef } from "react";
import {
    X,
    Calendar,
    Clock,
    Building2,
    BookOpen,
    Users,
    Repeat,
    Loader2,
} from "lucide-react";

import toast from "react-hot-toast";
import { useScheduleStore } from "../../../stores/useScheduleStore";

interface CreateScheduleProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormData {
    class_id: string;
    room_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    is_active: boolean;
}

interface FormErrors {
    class_id?: string;
    room_id?: string;
    day_of_week?: string;
    start_time?: string;
    end_time?: string;
    is_recurring?: string;
    is_active?: string;
}

export default function AdminCreateSchedule({
    isOpen,
    onClose,
    onSuccess,
}: CreateScheduleProps) {
    const {
        classes,
        rooms,
        createSchedule,
        isLoading: isStoreLoading,
    } = useScheduleStore();

    const [formData, setFormData] = useState<FormData>({
        class_id: "",
        room_id: "",
        day_of_week: "",
        start_time: "09:00",
        end_time: "10:30",
        is_recurring: true,
        is_active: true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Reset end time if start time is changed and end time is earlier
            ...(name === 'start_time' && value >= prev.end_time ? { end_time: '' } : {})
        }));

        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.class_id) {
            newErrors.class_id = "Please select a class";
        }

        if (!formData.room_id) {
            newErrors.room_id = "Please select a room";
        }

        if (!formData.day_of_week) {
            newErrors.day_of_week = "Please select a day";
        }

        if (!formData.start_time) {
            newErrors.start_time = "Start time is required";
        }

        if (!formData.end_time) {
            newErrors.end_time = "End time is required";
        } else if (formData.start_time && formData.end_time <= formData.start_time) {
            newErrors.end_time = "End time must be after start time";
        }

        // Calculate duration in minutes
        if (formData.start_time && formData.end_time && formData.end_time > formData.start_time) {
            const start = new Date(`2000-01-01T${formData.start_time}`);
            const end = new Date(`2000-01-01T${formData.end_time}`);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60);

            if (duration < 30) {
                newErrors.end_time = "Duration must be at least 30 minutes";
            }

            if (duration > 240) {
                newErrors.end_time = "Duration cannot exceed 4 hours";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = {
                ...formData,
                class_id: parseInt(formData.class_id),
                room_id: parseInt(formData.room_id),
            };

            await createSchedule(submitData);

            // Reset form
            resetForm();

            // Close modal and trigger success callback
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Error creating schedule:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            class_id: "",
            room_id: "",
            day_of_week: "",
            start_time: "09:00",
            end_time: "10:30",
            is_recurring: true,
            is_active: true,
        });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    const isLoading = isStoreLoading || isSubmitting;

    // Days of week options
    const daysOfWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
    ];

    // Generate time options
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(time);
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    // Calculate duration
    const calculateDuration = () => {
        if (!formData.start_time || !formData.end_time || formData.end_time <= formData.start_time) {
            return "0 min";
        }
        const start = new Date(`2000-01-01T${formData.start_time}`);
        const end = new Date(`2000-01-01T${formData.end_time}`);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60);
        return `${duration} min`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative bg-white px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-[#131C2E]" />
                        <h2 className="text-2xl font-bold text-gray-900">Add New Schedule</h2>
                    </div>

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Schedule Information */}
                        <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#131C2E]" />
                                Schedule Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Class Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Class *
                                    </label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            name="class_id"
                                            value={formData.class_id}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.class_id ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} ({cls.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.class_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.class_id}</p>
                                    )}
                                </div>

                                {/* Room Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Room *
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            name="room_id"
                                            value={formData.room_id}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.room_id ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select Room</option>
                                            {rooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.room_code} - {room.building} (Capacity: {room.capacity})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.room_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.room_id}</p>
                                    )}
                                </div>

                                {/* Day Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Day of Week *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            name="day_of_week"
                                            value={formData.day_of_week}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.day_of_week ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select Day</option>
                                            {daysOfWeek.map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.day_of_week && (
                                        <p className="text-sm text-red-600 mt-1">{errors.day_of_week}</p>
                                    )}
                                </div>

                                {/* Duration Display */}
                                <div className="flex items-end">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration
                                        </label>
                                        <div className="bg-gray-100 px-4 py-2.5 rounded-lg border border-gray-300">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {calculateDuration()}
                                                </span>
                                                <Clock className="w-4 h-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Time *
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.start_time ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            {timeOptions.map((time) => (
                                                <option key={time} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.start_time && (
                                        <p className="text-sm text-red-600 mt-1">{errors.start_time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Time *
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.end_time ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select End Time</option>
                                            {timeOptions
                                                .filter(time => !formData.start_time || time > formData.start_time)
                                                .map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    {errors.end_time && (
                                        <p className="text-sm text-red-600 mt-1">{errors.end_time}</p>
                                    )}
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="is_recurring"
                                            checked={formData.is_recurring}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-[#131C2E] focus:ring-[#131C2E] border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Repeat className="w-4 h-4 text-gray-600" />
                                        <label className="text-sm font-medium text-gray-700">
                                            Recurring Schedule
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-[#131C2E] focus:ring-[#131C2E] border-gray-300 rounded"
                                        />
                                    </div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Active Schedule
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Conflict Warning */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-blue-800 mb-1">
                                        Schedule Conflict Check
                                    </h5>
                                    <p className="text-xs text-blue-700">
                                        The system will automatically check for room availability and class conflicts before creating the schedule.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Schedule"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}