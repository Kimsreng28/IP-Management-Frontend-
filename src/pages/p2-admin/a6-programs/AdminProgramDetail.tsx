"use client";

import { useEffect, useState } from "react";
import {
    X,
    BookOpen,
    Hash,
    Clock,
    GraduationCap,
    Building,
    Calendar,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { useProgramStore } from "../../../stores/useProgramStore";

interface ProgramDetailProps {
    programId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface ProgramDetailData {
    id: string;
    name: string;
    description?: string;
    degree_lvl: number;
    duration: number;
    department_name: string;
    department_id: number;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
}

export default function AdminProgramDetail({
    programId,
    isOpen,
    onClose,
}: ProgramDetailProps) {
    const [program, setProgram] = useState<ProgramDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { fetchProgramById, degreeLevels } = useProgramStore();

    useEffect(() => {
        if (isOpen && programId) {
            fetchProgramDetail();
        }
    }, [isOpen, programId]);

    const fetchProgramDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const programData = await fetchProgramById(programId);

            if (programData) {
                setProgram(programData as ProgramDetailData);
            } else {
                setError("Failed to fetch program details");
            }
        } catch (err) {
            setError("Failed to load program details");
            console.error("Error fetching program:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getDegreeLevelLabel = (value: number) => {
        const level = degreeLevels.find((lvl) => lvl.value === value);
        return level?.label || `Level ${value}`;
    };

    const getStatusBadge = (isActive: boolean | undefined) => {
        if (isActive === undefined) return null;

        return (
            <div className="flex items-center gap-2">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {isActive ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Inactive
                        </>
                    )}
                </span>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative bg-white px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-[#131C2E]" />
                        <h2 className="text-2xl font-bold text-gray-900">Program Detail</h2>
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
                                onClick={fetchProgramDetail}
                                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : program ? (
                        <div className="space-y-6">
                            {/* Program Header */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">
                                            {program.name}
                                        </h3>
                                        {program.is_active !== undefined && (
                                            <div className="mt-2">
                                                {getStatusBadge(program.is_active)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {program.description && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed">
                                            {program.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Program Details */}
                                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-[#131C2E]" />
                                        Program Details
                                    </h4>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Degree Level</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {getDegreeLevelLabel(program.degree_lvl)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Duration</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {program.duration} years
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Department Information */}
                                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Building className="w-5 h-5 text-[#131C2E]" />
                                        Department Information
                                    </h4>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Department</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {program.department_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Department ID</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {program.department_id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Program ID Section */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-[#131C2E]" />
                                    Program Identification
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                                        <p className="text-sm text-gray-500">Program ID</p>
                                        <p className="text-lg font-mono font-bold text-gray-900">
                                            {program.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            {(program.created_at || program.updated_at) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {program.created_at && (
                                        <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-[#131C2E]" />
                                                Created
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {formatDate(program.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {program.updated_at && (
                                        <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-[#131C2E]" />
                                                Last Updated
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {formatDate(program.updated_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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