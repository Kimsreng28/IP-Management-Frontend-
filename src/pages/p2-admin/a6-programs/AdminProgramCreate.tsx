// components/admin/programs/AdminProgramCreate.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useProgramStore } from "../../../stores/useProgramStore";

interface AdminProgramCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
}

export default function AdminProgramCreate({
  isOpen,
  onClose,
  onCreateSuccess,
}: AdminProgramCreateProps) {
  const { createProgram, departments, degreeLevels, isLoading } =
    useProgramStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    degree_lvl: 1,
    duration: 4,
    department_id: departments[0]?.id || 0,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Program name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (!formData.department_id) {
      newErrors.department_id = "Please select a department";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createProgram(formData);
      onCreateSuccess();
      resetForm();
    } catch (error) {
      console.error("Failed to create program:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      degree_lvl: 1,
      duration: 4,
      department_id: departments[0]?.id || 0,
      is_active: true,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Program
            </h3>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter program name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter program description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department_id: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.department_id ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department_id}
                  </p>
                )}
              </div>

              {/* Degree Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree Level *
                </label>
                <select
                  value={formData.degree_lvl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      degree_lvl: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E]"
                >
                  {degreeLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.duration ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-[#131C2E] border-gray-300 rounded focus:ring-[#131C2E]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Active Program
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-[#131C2E] bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#131C2E] text-white font-medium rounded-lg hover:bg-[#1B2742] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Program"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
