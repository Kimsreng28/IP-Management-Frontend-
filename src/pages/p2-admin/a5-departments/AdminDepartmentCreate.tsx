"use client";

import { useState } from "react";
import {
  X,
  Building,
  User,
  FileText,
  Plus,
  Save,
  Building2,
  Trash2,
} from "lucide-react";
import { useDepartmentStore } from "../../../stores/useDepartmentStore";
import { toast } from "react-hot-toast";

interface SectionCreateData {
  name: string;
  description: string;
}

interface DepartmentCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess?: () => void;
}

export default function AdminDepartmentCreate({
  isOpen,
  onClose,
  onCreateSuccess,
}: DepartmentCreateProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hodUserId, setHodUserId] = useState("");
  const [sections, setSections] = useState<SectionCreateData[]>([]);
  const [newSection, setNewSection] = useState<SectionCreateData>({
    name: "",
    description: "",
  });
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    hod_user_id?: string;
  }>({});

  const { headOfDepartments, createDepartment } = useDepartmentStore();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      description?: string;
      hod_user_id?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Department name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Department description is required";
    }

    if (!hodUserId) {
      newErrors.hod_user_id = "Head of Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSection = () => {
    if (!newSection.name.trim() || !newSection.description.trim()) {
      toast.error("Please fill all section fields");
      return;
    }

    setSections([...sections, { ...newSection }]);
    setNewSection({ name: "", description: "" });
    setShowSectionForm(false);
  };

  const handleRemoveSection = (index: number) => {
    const sectionName = sections[index].name;
    if (confirm(`Remove section "${sectionName}" from the list?`)) {
      const updatedSections = sections.filter((_, i) => i !== index);
      setSections(updatedSections);
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    try {
      const departmentData = {
        name: name.trim(),
        description: description.trim(),
        hod_user_id: hodUserId,
        sections: sections.map(section => ({
          name: section.name.trim(),
          description: section.description.trim()
        }))
      };

      await createDepartment(departmentData);

      resetForm();
      onClose();
      if (onCreateSuccess) {
        onCreateSuccess();
      }
    } catch (error) {
      console.error("Failed to create department:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setHodUserId("");
    setSections([]);
    setNewSection({ name: "", description: "" });
    setShowSectionForm(false);
    setErrors({});
  };

  const handleCancel = () => {
    if (sections.length > 0 && !confirm('You have unsaved sections. Are you sure you want to cancel?')) {
      return;
    }
    resetForm();
    onClose();
  };

  const handleCancelSectionForm = () => {
    setNewSection({ name: "", description: "" });
    setShowSectionForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building2 className="w-7 h-7 text-[#131C2E]" />
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Department
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
            {/* Department Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Department Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name *
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
                    placeholder="Enter department name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Head of Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Head of Department *
                  </label>
                  <select
                    value={hodUserId}
                    onChange={(e) => {
                      setHodUserId(e.target.value);
                      if (errors.hod_user_id)
                        setErrors({ ...errors, hod_user_id: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-gray-900 ${
                      errors.hod_user_id ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Head of Department</option>
                    {headOfDepartments.map((hod) => (
                      <option key={hod.id} value={hod.id}>
                        {hod.name}
                      </option>
                    ))}
                  </select>
                  {errors.hod_user_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.hod_user_id}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
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
                  placeholder="Enter department description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Sections Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#131C2E]" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Sections
                  </h3>
                  <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {sections.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowSectionForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>

              {/* Add Section Form - Only show when showSectionForm is true */}
              {showSectionForm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Add New Section
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Name
                      </label>
                      <input
                        type="text"
                        value={newSection.name}
                        onChange={(e) =>
                          setNewSection({ ...newSection, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent"
                        placeholder="Enter section name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newSection.description}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent"
                        placeholder="Enter section description"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end items-center gap-3">
                    <button
                      onClick={handleCancelSectionForm}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSection}
                      className="flex items-center gap-2 px-4 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section to List
                    </button>
                  </div>
                </div>
              )}

              {/* Sections List */}
              {sections.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No sections added yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add sections to organize this department better
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                          No.
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Section Name
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sections.map((section, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-8 py-5 text-sm font-medium text-gray-900 w-20">
                            {index + 1}
                          </td>
                          <td className="px-8 py-5 text-lg font-semibold text-gray-900">
                            {section.name}
                          </td>
                          <td className="px-8 py-5 w-40">
                            <div className="flex items-center justify-end gap-4">
                              <button
                                onClick={() => handleRemoveSection(index)}
                                className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove section"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {sections.length > 0 && (
              <span className="font-medium">
                {sections.length} section{sections.length !== 1 ? 's' : ''} will be created with this department
              </span>
            )}
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
              disabled={isCreating}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Department
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}