"use client";

import { useEffect, useState } from "react";
import {
  X,
  Building,
  User,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  Building2,
} from "lucide-react";
import { useDepartmentStore } from "../../../stores/useDepartmentStore";
import { toast } from "react-hot-toast";
import AdminSectionDetail from "./AdminSectionDetail";
import AdminSectionEdit from "./AdminSectionEdit";
import AdminSectionCreate from "./AdminSectionCreate";
import { useSectionStore } from "../../../stores/useSectionStore";

interface Section {
  id: number;
  name: string;
  created_at: string;
}

interface DepartmentDetailData {
  id: number;
  name: string;
  description: string;
  hod_name: string;
  hod_user_id: string;
  created_at: string;
  sections: Section[];
}

interface DepartmentDetailProps {
  departmentId: number;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export default function AdminDepartmentDetail({
  departmentId,
  isOpen,
  onClose,
}: DepartmentDetailProps) {
  const [department, setDepartment] = useState<DepartmentDetailData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDepartment, setEditedDepartment] = useState<
    Partial<DepartmentDetailData>
  >({});

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );
  const [isSectionDetailOpen, setIsSectionDetailOpen] = useState(false);
  const [isSectionEditOpen, setIsSectionEditOpen] = useState(false);
  const [isSectionCreateOpen, setIsSectionCreateOpen] = useState(false);

  const { fetchDepartmentById, updateDepartment, headOfDepartments } =
    useDepartmentStore();

  useEffect(() => {
    if (isOpen && departmentId) {
      fetchDepartmentDetail();
    }
  }, [isOpen, departmentId]);

  useEffect(() => {
    if (department && !isEditing) {
      setEditedDepartment({
        name: department.name,
        description: department.description,
        hod_user_id: department.hod_user_id,
      });
    }
  }, [department, isEditing]);

  const fetchDepartmentDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const departmentData = await fetchDepartmentById(departmentId);

      if (departmentData) {
        setDepartment({
          ...departmentData,
          sections: departmentData.sections || [],
        });
        setEditedDepartment({
          name: departmentData.name,
          description: departmentData.description,
          hod_user_id: departmentData.hod_user_id,
        });
      } else {
        setError("Failed to fetch department details");
      }
    } catch (err) {
      setError("Failed to load department details");
      console.error("Error fetching department:", err);
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
    });
  };

  const handleDeleteSection = async (
    sectionId: number,
    sectionName: string
  ) => {
    const message = `Are you sure you want to delete the section "${sectionName}"?`;

    if (confirm(message)) {
      try {
        // Get the deleteSection function from the store
        const { deleteSection } = useSectionStore.getState();

        // Call the delete API
        await deleteSection(departmentId, sectionId);

        // Refresh the department details
        fetchDepartmentDetail();
      } catch (error) {
        console.error("Failed to delete section:", error);
        // Error toast is already shown by the store
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (
      !department ||
      !editedDepartment.name ||
      !editedDepartment.description ||
      !editedDepartment.hod_user_id
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await updateDepartment(department.id, {
        name: editedDepartment.name,
        description: editedDepartment.description,
        hod_user_id: editedDepartment.hod_user_id,
      });
      setIsEditing(false);
      await fetchDepartmentDetail();
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      if (department) {
        setEditedDepartment({
          name: department.name,
          description: department.description,
          hod_user_id: department.hod_user_id,
        });
      }
    } else {
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedDepartment((prev) => ({
      ...prev,
      [field]: value,
    }));
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
              {isEditing ? "Edit Department" : "Department Detail"}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchDepartmentDetail}
                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
              >
                Try Again
              </button>
            </div>
          ) : department ? (
            <div className="space-y-8">
              {/* Department Information */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDepartment.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-lg font-semibold text-gray-900 placeholder-gray-400"
                        placeholder="Enter department name"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-lg font-semibold text-gray-900">
                        {department.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Head of Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Head of Department *
                  </label>
                  {isEditing ? (
                    <select
                      value={editedDepartment.hod_user_id || ""}
                      onChange={(e) =>
                        handleInputChange("hod_user_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-gray-900"
                    >
                      <option value="">Select Head of Department</option>
                      {headOfDepartments.map((hod) => (
                        <option key={hod.id} value={hod.id}>
                          {hod.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900">
                      {department.hod_name}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#131C2E]" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Description
                  </h4>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedDepartment.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Enter department description"
                  />
                ) : (
                  <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 leading-relaxed">
                    {department.description}
                  </div>
                )}
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
                      {department.sections.length}
                    </span>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsSectionCreateOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  )}
                </div>

                {department.sections.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No sections found in this department
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
                          {!isEditing && (
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {department.sections.map((section, index) => (
                          <tr
                            key={section.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-8 py-5 text-sm font-medium text-gray-900 w-20">
                              {index + 1}
                            </td>
                            <td className="px-8 py-5 text-lg font-semibold text-gray-900">
                              {section.name}
                            </td>
                            {!isEditing && (
                              <td className="px-8 py-5 w-40">
                                <div className="flex items-center justify-end gap-4">
                                  <button
                                    onClick={() => {
                                      setSelectedSectionId(section.id);
                                      setIsSectionDetailOpen(true);
                                    }}
                                    className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View section"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedSectionId(section.id);
                                      setIsSectionEditOpen(true);
                                    }}
                                    className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Edit section"
                                  >
                                    <Edit2 className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSection(
                                        section.id,
                                        section.name
                                      )
                                    }
                                    className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete section"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated:{" "}
            {department ? formatDate(department.created_at) : "N/A"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {isEditing ? "Cancel" : "Close"}
            </button>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Department
              </button>
            )}
          </div>
        </div>

        {isSectionDetailOpen && selectedSectionId && (
          <AdminSectionDetail
            departmentId={departmentId}
            sectionId={selectedSectionId}
            departmentName={department?.name || ""}
            isOpen={isSectionDetailOpen}
            onClose={() => {
              setIsSectionDetailOpen(false);
              setSelectedSectionId(null);
            }}
            onEditClick={() => {
              setIsSectionDetailOpen(false);
              setIsSectionEditOpen(true);
            }}
            onDeleteSuccess={fetchDepartmentDetail}
          />
        )}

        {isSectionEditOpen && selectedSectionId && (
          <AdminSectionEdit
            departmentId={departmentId}
            sectionId={selectedSectionId}
            departmentName={department?.name || ""}
            isOpen={isSectionEditOpen}
            onClose={() => {
              setIsSectionEditOpen(false);
              setSelectedSectionId(null);
            }}
            onSaveSuccess={() => {
              setIsSectionEditOpen(false);
              setSelectedSectionId(null);
              fetchDepartmentDetail();
            }}
          />
        )}

        {isSectionCreateOpen && (
          <AdminSectionCreate
            departmentId={departmentId}
            departmentName={department?.name || ""}
            isOpen={isSectionCreateOpen}
            onClose={() => setIsSectionCreateOpen(false)}
            onCreateSuccess={() => {
              setIsSectionCreateOpen(false);
              fetchDepartmentDetail();
            }}
          />
        )}
      </div>
    </div>
  );
}
