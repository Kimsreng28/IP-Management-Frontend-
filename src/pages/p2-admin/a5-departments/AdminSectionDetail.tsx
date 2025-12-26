"use client";

import { useEffect } from "react";
import { X, FileText, Calendar, Building } from "lucide-react";
import { useSectionStore } from "../../../stores/useSectionStore";

interface SectionDetailProps {
  departmentId: number;
  sectionId: number;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
  onDeleteSuccess?: () => void;
}

export default function AdminSectionDetail({
  departmentId,
  sectionId,
  departmentName,
  isOpen,
  onClose,
}: SectionDetailProps) {
  const { currentSection, isLoading, error, fetchSection, clearError } =
    useSectionStore();

  useEffect(() => {
    if (isOpen && sectionId) {
      loadSection();
    }
  }, [isOpen, sectionId]);

  const loadSection = async () => {
    clearError();
    await fetchSection(departmentId, sectionId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
              Section Details
            </h2>
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
                onClick={loadSection}
                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
              >
                Try Again
              </button>
            </div>
          ) : currentSection ? (
            <div className="space-y-8">
              {/* Section Information */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Section Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Name
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-lg font-semibold text-gray-900">
                      {currentSection.name}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#131C2E]" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        Description
                      </h4>
                    </div>
                    <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 leading-relaxed">
                      {currentSection.description}
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900">
                      {currentSection.department_name || departmentName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Created {formatDate(currentSection.created_at)}
                  </span>
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
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
