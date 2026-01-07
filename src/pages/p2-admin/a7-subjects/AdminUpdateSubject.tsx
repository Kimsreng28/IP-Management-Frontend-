import { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  Hash,
  Clock,
  FileText,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { useSubjectStore } from "../../../stores/useSubjectStore";
import toast from "react-hot-toast";

interface UpdateSubjectProps {
  subjectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  code: string;
  name: string;
  description: string;
  total_hours: string;
  credits: string;
  program_id: string;
  teacher_info_id: string;
  semester_ids: number[];
}

interface FormErrors {
  code?: string;
  name?: string;
  description?: string;
  total_hours?: string;
  credits?: string;
  program_id?: string;
  teacher_info_id?: string;
  semester_ids?: string;
}

export default function AdminUpdateSubject({
  subjectId,
  isOpen,
  onClose,
  onSuccess,
}: UpdateSubjectProps) {
  const {
    programs,
    teachers,
    semesters,
    updateSubject,
    fetchSubjectById,
    isLoading,
  } = useSubjectStore();

  const [formData, setFormData] = useState<FormData>({
    code: "",
    name: "",
    description: "",
    total_hours: "",
    credits: "",
    program_id: "",
    teacher_info_id: "",
    semester_ids: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [isFetchingSubject, setIsFetchingSubject] = useState(false);

  // Get current subject data when modal opens
  useEffect(() => {
    if (isOpen && subjectId) {
      fetchSubjectData();
    }
  }, [isOpen, subjectId]);

  const fetchSubjectData = async () => {
    if (!subjectId) return;

    setIsFetchingSubject(true);
    try {
      const subject = await fetchSubjectById(subjectId);
      if (subject) {
        const semesterIds = subject.semesters?.map(s => s.id) || [];
        
        setFormData({
          code: subject.code || "",
          name: subject.name || "",
          description: subject.description || "",
          total_hours: subject.total_hours?.toString() || "",
          credits: subject.credits?.toString() || "",
          program_id: subject.program_id?.toString() || "",
          teacher_info_id: subject.teacher_info_id || "",
          semester_ids: semesterIds,
        });

        setSelectedSemesters(semesterIds);
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
      toast.error("Failed to load subject data");
    } finally {
      setIsFetchingSubject(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSemesterToggle = (semesterId: number) => {
    const newSemesterIds = [...selectedSemesters];
    const index = newSemesterIds.indexOf(semesterId);

    if (index === -1) {
      newSemesterIds.push(semesterId);
    } else {
      newSemesterIds.splice(index, 1);
    }

    setSelectedSemesters(newSemesterIds);
    setFormData((prev) => ({ ...prev, semester_ids: newSemesterIds }));

    // Clear error for semesters
    if (errors.semester_ids) {
      setErrors((prev) => ({ ...prev, semester_ids: undefined }));
    }
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const programId = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      program_id: programId,
      semester_ids: [], // Clear semesters when program changes
    }));
    setSelectedSemesters([]); // Clear selected semesters
    
    if (errors.program_id) {
      setErrors((prev) => ({ ...prev, program_id: undefined }));
    }
  };

  // Filter semesters by selected program
  const getFilteredSemesters = () => {
    if (!formData.program_id) {
      return [];
    }
    return semesters.filter(
      (semester) => semester.program_id.toString() === formData.program_id
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Subject code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Subject name is required";
    }

    if (!formData.total_hours.trim()) {
      newErrors.total_hours = "Total hours is required";
    } else if (isNaN(Number(formData.total_hours)) || Number(formData.total_hours) <= 0) {
      newErrors.total_hours = "Total hours must be a positive number";
    }

    if (!formData.credits.trim()) {
      newErrors.credits = "Credits is required";
    } else if (isNaN(Number(formData.credits)) || Number(formData.credits) <= 0) {
      newErrors.credits = "Credits must be a positive number";
    }

    if (!formData.program_id) {
      newErrors.program_id = "Please select a program";
    }

    if (!formData.teacher_info_id) {
      newErrors.teacher_info_id = "Please select a teacher";
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
        ...formData,
        total_hours: parseInt(formData.total_hours),
        credits: parseInt(formData.credits),
        program_id: parseInt(formData.program_id),
        semester_ids: formData.semester_ids,
      };

      await updateSubject(subjectId, submitData);

      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error: any) {
      console.error("Error updating subject:", error);
      toast.error(error.response?.data?.message || "Failed to update subject");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      total_hours: "",
      credits: "",
      program_id: "",
      teacher_info_id: "",
      semester_ids: [],
    });
    setErrors({});
    setSelectedSemesters([]);
  };

  if (!isOpen) return null;

  const filteredSemesters = getFilteredSemesters();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#131C2E]" />
            <h2 className="text-2xl font-bold text-gray-900">Edit Subject</h2>
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
          {isFetchingSubject ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
              <span className="ml-3 text-gray-600">
                Loading subject data...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject Information */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#131C2E]" />
                  Subject Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Code *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="e.g., CS101"
                        className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                          errors.code ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.code && (
                      <p className="text-sm text-red-600 mt-1">{errors.code}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Computer Science"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Hours *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="total_hours"
                        value={formData.total_hours}
                        onChange={handleInputChange}
                        placeholder="e.g., 36"
                        min="1"
                        className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                          errors.total_hours
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.total_hours && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.total_hours}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits *
                    </label>
                    <input
                      type="number"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      placeholder="e.g., 3"
                      min="1"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                        errors.credits ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.credits && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.credits}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program *
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        name="program_id"
                        value={formData.program_id}
                        onChange={handleProgramChange}
                        className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${
                          errors.program_id
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.program_id && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.program_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        name="teacher_info_id"
                        value={formData.teacher_info_id}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${
                          errors.teacher_info_id
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.code}) - {teacher.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.teacher_info_id && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.teacher_info_id}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter subject description"
                      rows={3}
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Semesters Selection */}
              {formData.program_id && (
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#131C2E]" />
                    Select Semesters (Optional)
                  </h4>

                  {filteredSemesters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredSemesters.map((semester) => (
                        <div
                          key={semester.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedSemesters.includes(semester.id)
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => handleSemesterToggle(semester.id)}
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={selectedSemesters.includes(semester.id)}
                              onChange={() => handleSemesterToggle(semester.id)}
                              className="h-4 w-4 text-[#131C2E] focus:ring-[#131C2E] border-gray-300 rounded"
                            />
                          </div>
                          <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                            {semester.name}
                            <p className="text-xs text-gray-500">
                              Year {semester.year_number}, Semester {semester.semester_number}
                            </p>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No semesters available for the selected program
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Selected: {selectedSemesters.length} semester(s)
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading || isFetchingSubject}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || isFetchingSubject}
            className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Subject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}