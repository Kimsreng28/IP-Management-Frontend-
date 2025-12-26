"use client";

import { useEffect, useState } from "react";
import { X, FileText, Building, Save } from "lucide-react";
import { useSectionStore } from "../../../stores/useSectionStore";
import { toast } from "react-hot-toast";

interface SectionEditProps {
  departmentId: number;
  sectionId: number;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function AdminSectionEdit({
  departmentId,
  sectionId,
  departmentName,
  isOpen,
  onClose,
  onSaveSuccess,
}: SectionEditProps) {
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    currentSection,
    isLoading,
    error,
    fetchSection,
    updateSection,
    clearError,
  } = useSectionStore();

  useEffect(() => {
    if (isOpen && sectionId) {
      loadSection();
    }
  }, [isOpen, sectionId]);

  useEffect(() => {
    if (currentSection) {
      setEditedName(currentSection.name);
      setEditedDescription(currentSection.description);
    }
  }, [currentSection]);

  const loadSection = async () => {
    clearError();
    await fetchSection(departmentId, sectionId);
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast.error("Section name is required");
      return;
    }

    if (!editedDescription.trim()) {
      toast.error("Section description is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateSection(departmentId, sectionId, {
        name: editedName,
        description: editedDescription,
      });
      
      onClose();
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Failed to update section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentSection) {
      setEditedName(currentSection.name);
      setEditedDescription(currentSection.description);
    }
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
            <h2 className="text-2xl font-bold text-gray-900">Edit Section</h2>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={loadSection}
                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
              >
                Try Again
              </button>
            </div>
          ) : currentSection ? (
            <div className="space-y-8">
              {/* Edit Form */}
              <div className="space-y-6">
                {/* Section Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Name *
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-lg font-semibold text-gray-900 placeholder-gray-400"
                    placeholder="Enter section name"
                  />
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
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Enter section description"
                  />
                </div>

                {/* Department (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative group">
                    <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 pr-12 cursor-not-allowed">
                      {currentSection.department_name || departmentName}
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
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
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
