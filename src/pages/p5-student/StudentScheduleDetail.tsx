"use client";

import { useEffect, useState } from "react";
import {
    X,
    Calendar,
    Clock,
    Building2,
    BookOpen,
    Users,
    MapPin,
    GraduationCap,
    Hash,
} from "lucide-react";
import { useScheduleStore } from "../../stores/useScheduleStore";

interface ScheduleDetailProps {
    scheduleId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface ScheduleDetailData {
    id: string;
    class_id: number;
    class_name: string;
    class_code: string;
    section_name: string;
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
    teacher_code?: string;
    subject_name?: string;
    subject_code?: string;
    semester_name?: string;
    program_name?: string;
    created_at?: string;
    updated_at?: string;
}

export default function StudentScheduleDetail({
    scheduleId,
    isOpen,
    onClose,
}: ScheduleDetailProps) {
    const [schedule, setSchedule] = useState<ScheduleDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { fetchScheduleById } = useScheduleStore();

    useEffect(() => {
        if (isOpen && scheduleId) {
            fetchScheduleDetail();
        }
    }, [isOpen, scheduleId]);

    const fetchScheduleDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const scheduleData = await fetchScheduleById(scheduleId);
            if (scheduleData) {
                setSchedule(scheduleData as ScheduleDetailData);
            } else {
                setError("Failed to fetch schedule details");
            }
        } catch (err) {
            setError("Failed to load schedule details");
            console.error("Error fetching schedule:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative bg-white px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-[#131C2E]" />
                        <h2 className="text-2xl font-bold text-gray-900">Class Schedule Details</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 text-lg">{error}</p>
                            <button
                                onClick={fetchScheduleDetail}
                                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : schedule ? (
                        <div className="space-y-6">
                            {/* Class Header */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        {schedule.class_name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#131C2E] text-white">
                                            {schedule.class_code}
                                        </span>
                                        {schedule.subject_code && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                <Hash className="w-3 h-3 mr-1" />
                                                {schedule.subject_code}
                                            </span>
                                        )}
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDayBadgeColor(
                                                schedule.day_of_week
                                            )}`}
                                        >
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {schedule.day_of_week}
                                        </span>
                                    </div>
                                </div>

                                {/* Time Slot */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Class Time</p>
                                                <p className="text-2xl font-bold text-blue-800">
                                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                </p>
                                                <p className="text-sm text-blue-600">
                                                    Duration: {schedule.duration} minutes
                                                </p>
                                            </div>
                                        </div>
                                        {schedule.is_recurring && (
                                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                Weekly Class
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Class Information */}
                                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-[#131C2E]" />
                                        Class Information
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Class Name</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {schedule.class_name}
                                                </p>
                                                {schedule.section_name && (
                                                    <p className="text-sm text-gray-600">
                                                        Section: {schedule.section_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {schedule.subject_name && (
                                            <div className="flex items-start gap-3">
                                                <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Subject</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {schedule.subject_name}
                                                    </p>
                                                    {schedule.subject_code && (
                                                        <p className="text-sm text-gray-600">
                                                            Code: {schedule.subject_code}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {schedule.semester_name && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Semester</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {schedule.semester_name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Teacher Information */}
                                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#131C2E]" />
                                        Teacher Information
                                    </h4>

                                    <div className="space-y-4">
                                        {schedule.teacher_name ? (
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Instructor</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {schedule.teacher_name}
                                                    </p>
                                                    {schedule.teacher_code && (
                                                        <p className="text-sm text-gray-600">
                                                            ID: {schedule.teacher_code}
                                                        </p>
                                                    )}
                                                    {schedule.teacher_email && (
                                                        <p className="text-sm text-gray-600">
                                                            Email: {schedule.teacher_email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Instructor</p>
                                                    <p className="text-base font-medium text-gray-900 text-gray-400">
                                                        Not assigned
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {schedule.program_name && (
                                            <div className="flex items-start gap-3">
                                                <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Program</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {schedule.program_name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Room Information */}
                            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-[#131C2E]" />
                                    Venue Information
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Room</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {schedule.room_code}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Building: {schedule.building}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {schedule.building} Building
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Room: {schedule.room_code}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Capacity</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {schedule.capacity} students
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Schedule Type</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {schedule.is_recurring ? "Weekly Recurring" : "One-time"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Every {schedule.day_of_week}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Notes for Students */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                                <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Important Notes
                                </h4>
                                <ul className="space-y-2 text-sm text-blue-800">
                                    <li className="flex items-start gap-2">
                                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                                        <span>Please arrive at least 5 minutes before the class starts</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                                        <span>Bring your student ID card for verification</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                                        <span>Attendance will be taken at the beginning of each class</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}