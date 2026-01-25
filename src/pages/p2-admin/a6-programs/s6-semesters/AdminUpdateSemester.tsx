// components/admin/semesters/SemesterEditModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSemesterStore } from "../../../../stores/useSemesterStore";

interface SemesterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId: number;
  semesterId: string;
  dataSetup: any;
  onEditSuccess: () => void;
}

interface FormData {
  name: string;
  semester_number: number;
  year_number: number;
  start_date: string;
  end_date: string;
  academic_year_id: string;
  subject_ids: number[];
  is_active: boolean;
}

export default function SemesterEditModal({
  isOpen,
  onClose,
  programId,
  semesterId,
  dataSetup,
  onEditSuccess,
}: SemesterEditModalProps) {
  const { updateSemester, fetchSemesterById, isLoading } = useSemesterStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    semester_number: 1,
    year_number: 1,
    start_date: "",
    end_date: "",
    academic_year_id: "",
    subject_ids: [],
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetching, setIsFetching] = useState(false);

  // Fetch semester data when modal opens
  useEffect(() => {
    const loadSemesterData = async () => {
      if (!isOpen || !semesterId) return;

      setIsFetching(true);
      try {
        const semester = await fetchSemesterById(programId, semesterId);
        
        if (semester) {
          setFormData({
            name: semester.name,
            semester_number: semester.semester_number,
            year_number: semester.year_number,
            start_date: semester.start_date.split('T')[0], // Format date for input
            end_date: semester.end_date.split('T')[0], // Format date for input
            academic_year_id: semester.academic_year_id.toString(),
            subject_ids: semester.subjects.map(subject => subject.id),
            is_active: semester.is_active,
          });
        }
      } catch (error) {
        console.error("Error loading semester data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    loadSemesterData();
  }, [isOpen, semesterId, programId, fetchSemesterById]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Semester name is required";
    }

    if (formData.semester_number < 1) {
      newErrors.semester_number = "Semester number must be at least 1";
    }

    if (formData.year_number < 1) {
      newErrors.year_number = "Year number must be at least 1";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (!formData.academic_year_id) {
      newErrors.academic_year_id = "Academic year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Prepare update payload - only send changed fields
      const updatePayload: any = {};
      
      // Always send these required fields
      updatePayload.name = formData.name;
      updatePayload.semester_number = formData.semester_number;
      updatePayload.year_number = formData.year_number;
      updatePayload.start_date = formData.start_date;
      updatePayload.end_date = formData.end_date;
      updatePayload.academic_year_id = Number(formData.academic_year_id);
      updatePayload.is_active = formData.is_active;
      
      // Send subject_ids only if it's different
      updatePayload.subject_ids = formData.subject_ids;

      await updateSemester(programId, semesterId, updatePayload);
      onEditSuccess();
    } catch (error) {
      console.error("Failed to update semester:", error);
    }
  };

  const handleSubjectToggle = (subjectId: number) => {
    setFormData(prev => ({
      ...prev,
      subject_ids: prev.subject_ids.includes(subjectId)
        ? prev.subject_ids.filter(id => id !== subjectId)
        : [...prev.subject_ids, subjectId]
    }));
  };

  const handleClose = () => {
    setFormData({
      name: "",
      semester_number: 1,
      year_number: 1,
      start_date: "",
      end_date: "",
      academic_year_id: "",
      subject_ids: [],
      is_active: true,
    });
    setErrors({});
    onClose();
  };

  if (isFetching) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />
          <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Semester
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Update semester information and assigned subjects
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Semester Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester Name *
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
                  placeholder="e.g., Fall Semester 2024"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Year Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Number *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.year_number}
                  onChange={(e) =>
                    setFormData({ ...formData, year_number: parseInt(e.target.value) || 1 })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.year_number ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.year_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.year_number}</p>
                )}
              </div>

              {/* Semester Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester Number *
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={formData.semester_number}
                  onChange={(e) =>
                    setFormData({ ...formData, semester_number: parseInt(e.target.value) || 1 })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.semester_number ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.semester_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.semester_number}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.start_date ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.end_date ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                )}
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year *
                </label>
                <select
                  value={formData.academic_year_id}
                  onChange={(e) =>
                    setFormData({ ...formData, academic_year_id: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] ${
                    errors.academic_year_id ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Academic Year</option>
                  {dataSetup.academic_years.map((year: any) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
                {errors.academic_year_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.academic_year_id}</p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-[#131C2E] border-gray-300 rounded focus:ring-[#131C2E]"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Active Semester
                </span>
              </div>

              {/* Subjects Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Subjects ({formData.subject_ids.length} selected)
                </label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  {dataSetup.subjects.length === 0 ? (
                    <p className="text-gray-500 text-sm">No subjects available for this program</p>
                  ) : (
                    <div className="space-y-2">
                      {dataSetup.subjects.map((subject: any) => {
                        const isSelected = formData.subject_ids.includes(subject.id);
                        return (
                          <label
                            key={subject.id}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSubjectToggle(subject.id)}
                              className="w-4 h-4 text-[#131C2E] border-gray-300 rounded focus:ring-[#131C2E]"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className={`text-sm font-medium ${
                                    isSelected ? 'text-blue-800' : 'text-gray-900'
                                  }`}>
                                    {subject.name}
                                  </span>
                                  <div className="flex gap-2 text-xs mt-1">
                                    <span className={`px-2 py-0.5 rounded ${
                                      isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {subject.code}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded ${
                                      isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {subject.credits} credits
                                    </span>
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    Assigned
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected subjects will be available in this semester's curriculum
                </p>
              </div>

              {/* Clear Subjects Option */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, subject_ids: [] }))}
                  className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                  disabled={formData.subject_ids.length === 0}
                >
                  Clear all subjects
                </button>
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
                {isLoading ? "Updating..." : "Update Semester"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}