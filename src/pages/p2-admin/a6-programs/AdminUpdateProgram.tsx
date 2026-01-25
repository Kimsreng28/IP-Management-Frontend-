"use client";

import { useState, useEffect } from "react";
import {
    X,
    BookOpen,
    Clock,
    FileText,
    GraduationCap,
    Building,
    Loader2,
} from "lucide-react";
import { useProgramStore } from "../../../stores/useProgramStore";
import toast from "react-hot-toast";

interface UpdateProgramProps {
    programId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormData {
    name: string;
    description: string;
    degree_lvl: string;
    duration: string;
    department_id: string;
    is_active: boolean;
}

interface FormErrors {
    name?: string;
    degree_lvl?: string;
    duration?: string;
    department_id?: string;
}

export default function AdminUpdateProgram({
    programId,
    isOpen,
    onClose,
    onSuccess,
}: UpdateProgramProps) {
    const {
        departments,
        degreeLevels,
        updateProgram,
        fetchProgramById,
        isLoading,
    } = useProgramStore();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        degree_lvl: "",
        duration: "",
        department_id: "",
        is_active: true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isFetchingProgram, setIsFetchingProgram] = useState(false);

    // Get current program data when modal opens
    useEffect(() => {
        if (isOpen && programId) {
            fetchProgramData();
        }
    }, [isOpen, programId]);

    const fetchProgramData = async () => {
        if (!programId) return;

        setIsFetchingProgram(true);
        try {
            const program = await fetchProgramById(programId);
            if (program) {
                setFormData({
                    name: program.name || "",
                    description: program.description || "",
                    degree_lvl: program.degree_lvl?.toString() || "",
                    duration: program.duration?.toString() || "",
                    department_id: program.department_id?.toString() || "",
                    is_active: program.is_active !== undefined ? program.is_active : true,
                });
            }
        } catch (error) {
            console.error("Error fetching program data:", error);
            toast.error("Failed to load program data");
        } finally {
            setIsFetchingProgram(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Program name is required";
        }

        if (!formData.degree_lvl) {
            newErrors.degree_lvl = "Degree level is required";
        } else if (isNaN(Number(formData.degree_lvl))) {
            newErrors.degree_lvl = "Degree level must be a valid number";
        }

        if (!formData.duration) {
            newErrors.duration = "Duration is required";
        } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
            newErrors.duration = "Duration must be a positive number";
        }

        if (!formData.department_id) {
            newErrors.department_id = "Please select a department";
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

        try {
            const submitData = {
                name: formData.name,
                description: formData.description,
                degree_lvl: parseInt(formData.degree_lvl),
                duration: parseInt(formData.duration),
                department_id: parseInt(formData.department_id),
                is_active: formData.is_active,
            };

            await updateProgram(programId, submitData);

            // Trigger success callback
            if (onSuccess) {
                onSuccess();
            }

            // Close modal
            onClose();
        } catch (error: any) {
            console.error("Error updating program:", error);
            toast.error(error.response?.data?.message || "Failed to update program");
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            degree_lvl: "",
            duration: "",
            department_id: "",
            is_active: true,
        });
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative bg-white px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-[#131C2E]" />
                        <h2 className="text-2xl font-bold text-gray-900">Edit Program</h2>
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
                    {isFetchingProgram ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
                            <span className="ml-3 text-gray-600">
                                Loading program data...
                            </span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Program Information */}
                            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-[#131C2E]" />
                                    Program Information
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Program Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Computer Science"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Degree Level *
                                        </label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <select
                                                name="degree_lvl"
                                                value={formData.degree_lvl}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.degree_lvl
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }`}
                                            >
                                                <option value="">Select Degree Level</option>
                                                {degreeLevels.map((level) => (
                                                    <option key={level.value} value={level.value}>
                                                        {level.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.degree_lvl && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.degree_lvl}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (Years) *
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 4"
                                                min="1"
                                                max="10"
                                                className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${errors.duration ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        {errors.duration && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.duration}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department *
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <select
                                                name="department_id"
                                                value={formData.department_id}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${errors.department_id
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }`}
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.id}>
                                                        {department.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.department_id && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.department_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Enter program description"
                                                rows={3}
                                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                checked={formData.is_active}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-[#131C2E] focus:ring-[#131C2E] border-gray-300 rounded"
                                                id="is_active"
                                            />
                                            <label
                                                htmlFor="is_active"
                                                className="ml-2 text-sm font-medium text-gray-700"
                                            >
                                                Active Program
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Uncheck to deactivate this program
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        disabled={isLoading || isFetchingProgram}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading || isFetchingProgram}
                        className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Program"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}