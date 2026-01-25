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
    Users,
    Layers,
    ChevronRight,
    Plus,
} from "lucide-react";
import { useProgramStore } from "../../../stores/useProgramStore";
import { useSemesterStore } from "../../../stores/useSemesterStore";
import SemesterCreateModal from "./s6-semesters/AdminCreateSemester";
import SemesterEditModal from "./s6-semesters/AdminUpdateSemester";


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

export default function AdminProgramDetail({
    programId,
    isOpen,
    onClose,
}: ProgramDetailProps) {
    const [program, setProgram] = useState<ProgramDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'semesters'>('overview');
    const [expandedYear, setExpandedYear] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSemester, setEditingSemester] = useState<string | null>(null);

    const { fetchProgramById, degreeLevels } = useProgramStore();
    const { 
        semesters, 
        dataSetup, 
        isLoading: semestersLoading, 
        fetchSemestersByProgram, 
        deleteSemester 
    } = useSemesterStore();

    useEffect(() => {
        if (isOpen && programId) {
            fetchProgramDetail();
            fetchSemestersByProgram(parseInt(programId));
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

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getDegreeLevelLabel = (value: number) => {
        const level = degreeLevels.find((lvl) => lvl.value === value);
        return level?.label || `Level ${value}`;
    };

    const getStatusBadge = (isActive: boolean | undefined) => {
        if (isActive === undefined) return null;

        return (
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
        );
    };

    const handleDeleteSemester = async (semesterId: string) => {
        if (window.confirm("Are you sure you want to delete this semester?")) {
            await deleteSemester(parseInt(programId), semesterId);
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchSemestersByProgram(parseInt(programId));
    };

    const handleEditSuccess = () => {
        setEditingSemester(null);
        fetchSemestersByProgram(parseInt(programId));
    };

    // Group semesters by year
    const semestersByYear = semesters.reduce((acc, semester) => {
        const year = semester.year_number;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(semester);
        return acc;
    }, {} as Record<number, Semester[]>);

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Program Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {program!.name}
                        </h3>
                        {program!.is_active !== undefined && (
                            <div className="mt-2">
                                {getStatusBadge(program!.is_active)}
                            </div>
                        )}
                    </div>
                </div>

                {program!.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                            {program!.description}
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
                                    {getDegreeLevelLabel(program!.degree_lvl)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="text-base font-medium text-gray-900">
                                    {program!.duration} years
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Layers className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Total Semesters</p>
                                <p className="text-base font-medium text-gray-900">
                                    {semesters.length}
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
                                    {program!.department_name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Department ID</p>
                                <p className="text-base font-medium text-gray-900">
                                    {program!.department_id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <h4 className="font-medium text-blue-800 text-sm">Semesters</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{semesters.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-800 text-sm">Years</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600 mt-2">{Object.keys(semestersByYear).length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <h4 className="font-medium text-purple-800 text-sm">Total Subjects</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                        {semesters.reduce((sum, semester) => sum + semester.subjects_count, 0)}
                    </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <h4 className="font-medium text-orange-800 text-sm">Duration</h4>
                    </div>
                    <p className="text-2xl font-bold text-orange-600 mt-2">{program!.duration} yrs</p>
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
                            {program!.id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Metadata */}
            {(program!.created_at || program!.updated_at) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {program!.created_at && (
                        <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#131C2E]" />
                                Created
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="text-base font-medium text-gray-900">
                                        {formatDate(program!.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {program!.updated_at && (
                        <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#131C2E]" />
                                Last Updated
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="text-base font-medium text-gray-900">
                                        {formatDate(program!.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderSemestersTab = () => {
        if (semestersLoading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#131C2E]"></div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Semesters Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Semester Management</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage academic semesters for {program!.name}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#131C2E] text-white font-medium rounded-lg hover:bg-[#1B2742] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Semester
                    </button>
                </div>

                {/* Data Setup Info */}
                {dataSetup && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-1 text-sm">Available Subjects</h3>
                            <p className="text-2xl font-bold text-blue-600">{dataSetup.subjects.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-1 text-sm">Academic Years</h3>
                            <p className="text-2xl font-bold text-green-600">{dataSetup.academic_years.length}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-purple-800 mb-1 text-sm">Total Semesters</h3>
                            <p className="text-2xl font-bold text-purple-600">{semesters.length}</p>
                        </div>
                    </div>
                )}

                {/* Semesters List */}
                <div className="space-y-4">
                    {Object.entries(semestersByYear)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([year, yearSemesters]) => (
                            <div key={year} className="border rounded-lg overflow-hidden">
                                {/* Year Header */}
                                <div
                                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setExpandedYear(expandedYear === Number(year) ? null : Number(year))}
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Year {year} ({yearSemesters.length} semesters)
                                        </h3>
                                    </div>
                                    <ChevronRight 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${expandedYear === Number(year) ? 'rotate-90' : ''}`}
                                    />
                                </div>

                                {/* Year Semesters */}
                                {expandedYear === Number(year) && (
                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {yearSemesters
                                                .sort((a, b) => a.semester_number - b.semester_number)
                                                .map((semester) => (
                                                    <div
                                                        key={semester.id}
                                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{semester.name}</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Semester {semester.semester_number}
                                                                </p>
                                                            </div>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                semester.is_active 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {semester.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2 mb-4">
                                                            <div className="text-sm text-gray-600">
                                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                                {formatShortDate(semester.start_date)} - {formatShortDate(semester.end_date)}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <BookOpen className="w-4 h-4 inline mr-2" />
                                                                {semester.subjects_count} subjects
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Academic Year: {semester.academic_year_name}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 pt-3 border-t">
                                                            <button
                                                                onClick={() => setEditingSemester(semester.id)}
                                                                className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSemester(semester.id)}
                                                                className="flex-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>

                {/* Empty State */}
                {semesters.length === 0 && !semestersLoading && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No semesters yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Add semesters to organize the academic schedule for this program.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#131C2E] text-white font-medium rounded-lg hover:bg-[#1B2742] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Semester
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="relative bg-white px-6 py-5 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="w-6 h-6 text-[#131C2E]" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {program ? program.name : 'Program Detail'}
                            </h2>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-6">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`pb-3 px-1 font-medium transition-colors relative ${
                                    activeTab === 'overview'
                                        ? 'text-[#131C2E]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Overview
                                {activeTab === 'overview' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#131C2E]" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('semesters')}
                                className={`pb-3 px-1 font-medium transition-colors relative flex items-center gap-2 ${
                                    activeTab === 'semesters'
                                        ? 'text-[#131C2E]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Calendar className="w-4 h-4" />
                                Semesters
                                {activeTab === 'semesters' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#131C2E]" />
                                )}
                            </button>
                        </div>
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
                            activeTab === 'overview' ? renderOverviewTab() : renderSemestersTab()
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

            {/* Modals */}
            {isCreateModalOpen && dataSetup && (
                <SemesterCreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    programId={parseInt(programId)}
                    dataSetup={dataSetup}
                    onCreateSuccess={handleCreateSuccess}
                />
            )}

            {editingSemester && dataSetup && (
                <SemesterEditModal
                    isOpen={!!editingSemester}
                    onClose={() => setEditingSemester(null)}
                    programId={parseInt(programId)}
                    semesterId={editingSemester}
                    dataSetup={dataSetup}
                    onEditSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}