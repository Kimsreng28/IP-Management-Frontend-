"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTeacherStore } from "../../../stores/useTeacherStore";
import TeacherViewDetail from "./HodTeacherDetail";
import toast from "react-hot-toast"; 

export default function HodTeachers() {
  const {
    // Data
    teachers,
    departments,
    meta,

    // UI State
    isLoading,

    // Filters
    filters,

    // Actions
    fetchTeachersForHod,
    deleteTeacher, 

    // Filter management
    setFilter,
    resetFilters,

    // Pagination
    goToPage,
    setItemsPerPage,
  } = useTeacherStore();

  const genders = ["Male", "Female"];

  // Handle clear filters
  const handleClearFilters = () => {
    resetFilters();
  };

  // state variables inside the AdminTeachers component
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false); 
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null); 

  // Add handlers for opening/closing the update modal
  const handleEditTeacher = (teacherId: string) => {
    setEditingTeacherId(teacherId);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setEditingTeacherId(null);
  };

  // Add handlers for opening/closing the modal
  const handleViewTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedTeacherId(null);
  };

  // Handle delete teacher
  const handleDeleteTeacher = async (
    id: string,
    name_kh: string,
    name_en: string
  ) => {
    const message = `Are you sure you want to delete this teacher?\n\n${name_kh} (${name_en})`;

    if (confirm(message)) {
      try {
        await deleteTeacher(id);
      } catch (error) {
        console.error("Failed to delete teacher:", error);
        toast.error("Failed to delete teacher");
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchTeachersForHod();
  }, []);

  // Debounced search and filter updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTeachersForHod();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    filters.search,
    filters.department,
    filters.gender,
    filters.sort_by,
    filters.sort_order,
    filters.page,
    filters.limit,
  ]);

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter("search", e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter("department", e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter("gender", e.target.value);
  };

  // Handle column sorting
  const handleSort = (column: "teacher_id" | "name_en" | "name_kh" | "dob") => {
    const currentSortBy = filters.sort_by;
    const currentSortOrder = filters.sort_order;

    if (currentSortBy === column) {
      // If already sorting by this column, toggle order
      setFilter("sort_order", currentSortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      // If sorting by a different column, set new column with default ASC order
      setFilter("sort_by", column);
      setFilter("sort_order", "ASC");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search and Filters Section */}
      <div className="p-6 border-b border-gray-200">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
     focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E]
     text-base placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="
            flex items-center justify-center gap-2
            px-6 py-3
            bg-[#131C2E] text-white font-medium 
            rounded-lg
            hover:bg-[#1B2742]
            active:bg-[#0E1524]
            transition-colors 
            shadow-sm
          "
            >
              <Plus className="w-5 h-5" />
              <span>Add Teacher</span>
            </button>
          </div> */}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* <select
            value={filters.department || ""}
            onChange={handleDepartmentChange}
            className="
              px-4 py-2.5
              border border-gray-300 rounded-lg
              bg-gray-50
              hover:border-gray-400
              focus:ring-2 focus:ring-[#131C2E]
              focus:border-[#131C2E]
              cursor-pointer
              outline-none
              text-sm
              transition-colors
              min-w-[180px]
            "
          >
            <option value="">Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select> */}

          <select
            value={filters.gender || ""}
            onChange={handleGenderChange}
            className="
              px-4 py-2.5
              border border-gray-300 rounded-lg
              bg-gray-50
              hover:border-gray-400
              focus:ring-2 focus:ring-[#131C2E]
              focus:border-[#131C2E]
              cursor-pointer
              outline-none
              text-sm
              transition-colors
              min-w-[120px]
            "
          >
            <option value="">Gender</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          {/* Push Clear button to the end */}
          <div className="flex-1" />

          <button
            onClick={handleClearFilters}
            className="
              px-4 py-2.5
              text-[#131C2E]
              bg-transparent
              rounded-lg
              hover:bg-gray-100
              active:bg-gray-200
              transition-colors
              text-sm
              font-medium
            "
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Teacher ID */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("teacher_id")}
              >
                <div className="flex items-center gap-1">
                  ID
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "teacher_id" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Khmer Name */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name_kh")}
              >
                <div className="flex items-center gap-1">
                  Khmer Name
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "name_kh" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Latin Name */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name_en")}
              >
                <div className="flex items-center gap-1">
                  Latin Name
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "name_en" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Gender */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Gender
              </th>

              {/* Email */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>

              {/* Phone */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone
              </th>

              {/* Department */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Department
              </th>

              {/* Actions */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Show skeleton rows during initial load
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : teachers.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No teachers found
                </td>
              </tr>
            ) : (
              // Real data
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {teacher.teacher_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {teacher.name_kh}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {teacher.name_en}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        teacher.gender === "Male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {teacher.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewTeacher(teacher.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* <button
                        onClick={() => handleEditTeacher(teacher.id)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteTeacher(
                            teacher.id,
                            teacher.name_kh,
                            teacher.name_en
                          )
                        }
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Open Teacher Model */}
      {selectedTeacherId && (
        <TeacherViewDetail
          teacherId={selectedTeacherId}
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}

      {/* Pagination */}
      {meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4">
          {/* Left: items per page and total */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Showing</span>
            <select
              value={filters.limit || 10}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="
                px-3 py-1
                border border-gray-300 rounded-lg
                bg-white
                focus:ring-2 focus:ring-[#131C2E]
                focus:border-[#131C2E]
                outline-none
                cursor-pointer
              "
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>of {meta.total} teachers</span>
          </div>

          {/* Right: pagination controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(Math.max(1, (meta.page || 1) - 1))}
              disabled={meta.page === 1}
              className="
                px-3 py-1.5
                text-[#131C2E]
                bg-white
                border border-gray-300
                rounded-lg
                hover:bg-gray-100
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
                text-sm
              "
            >
              Previous
            </button>

            <div className="flex gap-1">
              {/* Generate page numbers */}
              {Array.from(
                { length: Math.min(5, Math.ceil(meta.total / meta.limit)) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-lg font-medium transition-colors text-sm ${
                    meta.page === page
                      ? "bg-[#131C2E] text-white"
                      : "text-[#131C2E] bg-white border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {Math.ceil(meta.total / meta.limit) > 5 && (
                <>
                  <span className="flex items-center px-2 text-gray-500">
                    ...
                  </span>
                  <button
                    onClick={() => goToPage(Math.ceil(meta.total / meta.limit))}
                    className={`w-9 h-9 rounded-lg font-medium transition-colors text-sm ${
                      meta.page === Math.ceil(meta.total / meta.limit)
                        ? "bg-[#131C2E] text-white"
                        : "text-[#131C2E] bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {Math.ceil(meta.total / meta.limit)}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => goToPage((meta.page || 1) + 1)}
              disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
              className="
                px-3 py-1.5
                text-[#131C2E]
                bg-white
                border border-gray-300
                rounded-lg
                hover:bg-gray-100
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
                text-sm
              "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}