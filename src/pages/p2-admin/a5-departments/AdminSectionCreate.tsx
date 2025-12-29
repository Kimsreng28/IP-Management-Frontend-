"use client";

import { useState } from "react";
import { X, FileText, Building, Save} from "lucide-react";
import { useSectionStore } from "../../../stores/useSectionStore";

interface SectionCreateProps {
  departmentId: number;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess?: () => void;
}

export default function AdminSectionCreate({
  departmentId,
  departmentName,
  isOpen,
  onClose,
  onCreateSuccess,
}: SectionCreateProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

  const { createSection, isLoading, error, clearError } = useSectionStore();

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Section name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Section name must be at least 2 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Section description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    clearError();

    try {
      await createSection(departmentId, {
        name: name.trim(),
        description: description.trim(),
      });
      resetForm();
      onClose();
      if (onCreateSuccess) {
        onCreateSuccess();
      }
    } catch (error) {
      console.error("Failed to create section:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setErrors({});
    clearError();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building className="w-7 h-7 text-[#131C2E]" />
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Section
            </h2>
          </div>

          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Create Form */}
            <div className="space-y-6">
              {/* Section Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-lg font-semibold text-gray-900 placeholder-gray-400 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter section name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#131C2E]" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Description *
                  </h4>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors({ ...errors, description: undefined });
                  }}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter section description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Department (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 cursor-not-allowed">
                  {departmentName}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This section will be created under the {departmentName}{" "}
                  department
                </p>
              </div>
            </div>

            {/* API Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="flex-1">
            {/* Empty left side to maintain spacing */}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Section
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
