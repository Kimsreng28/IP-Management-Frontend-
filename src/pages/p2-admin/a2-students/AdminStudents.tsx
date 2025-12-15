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
import toast from "react-hot-toast";
import { useStudentStore } from "../../../stores/useStudentStore";
import StudentViewDetail from "./AdminStudentDetail";

export default function AdminStudents() {
  const {
    // Data
    students,
    departments,
    sections,
    programs,
    meta,

    // UI State
    isLoading,

    // Filters
    filters,
    selectedStudents,

    // Actions
    fetchStudents,
    deleteStudent,
    deleteMultipleStudents,

    // Filter management
    setFilter,
    resetFilters,

    // Selection
    selectAllStudents,
    deselectAllStudents,
    toggleStudentSelection,

    // Pagination
    goToPage,
    setItemsPerPage,
  } = useStudentStore();

  const genders = ["Male", "Female"];

  // Add state for the modal in the component:
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  // Add handlers for opening/closing the modal:
  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedStudentId(null);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    filters.search,
    filters.department,
    filters.program,
    filters.section,
    filters.gender,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit,
  ]);

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
      </td>
      {[...Array(9)].map((_, i) => (
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

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter("program", e.target.value);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter("section", e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter("gender", e.target.value);
  };

  // Handle column sorting
  const handleSort = (column: "student_id" | "name_en" | "name_kh" | "dob") => {
    const currentSortBy = filters.sortBy;
    const currentSortOrder = filters.sortOrder;

    if (currentSortBy === column) {
      // If already sorting by this column, toggle order
      setFilter("sortOrder", currentSortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      // If sorting by a different column, set new column with default ASC order
      setFilter("sortBy", column);
      setFilter("sortOrder", "ASC");
    }
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAllStudents();
    } else {
      deselectAllStudents();
    }
  };

  // Handle delete
  const handleDeleteStudent = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) {
      toast.error("No students selected");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedStudents.length} student(s)?`
      )
    ) {
      await deleteMultipleStudents(selectedStudents);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    resetFilters();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          <div className="flex gap-2">
            {selectedStudents.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="
                  flex items-center justify-center gap-2
                  px-6 py-3
                  bg-red-600 text-white font-medium 
                  rounded-lg
                  hover:bg-red-700
                  active:bg-red-800
                  transition-colors 
                  shadow-sm
                "
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Selected ({selectedStudents.length})</span>
              </button>
            )}

            <button
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
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
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
          </select>

          <select
            value={filters.program || ""}
            onChange={handleProgramChange}
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
            <option value="">Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>

          <select
            value={filters.section || ""}
            onChange={handleSectionChange}
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
              min-w-[150px]
            "
          >
            <option value="">Section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>

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
              <th className="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  checked={
                    selectedStudents.length === students.length &&
                    students.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              {/* Student ID */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("student_id")}
              >
                <div className="flex items-center gap-1">
                  ID
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sortOrder === "ASC" ? (
                      <ArrowUp size={14} className="text-gray-700" />
                    ) : (
                      <ArrowDown size={14} className="text-gray-700" />
                    )}
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
                    {filters.sortOrder === "ASC" ? (
                      <ArrowUp size={14} className="text-gray-700" />
                    ) : (
                      <ArrowDown size={14} className="text-gray-700" />
                    )}
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
                    {filters.sortOrder === "ASC" ? (
                      <ArrowUp size={14} className="text-gray-700" />
                    ) : (
                      <ArrowDown size={14} className="text-gray-700" />
                    )}
                  </span>
                </div>
              </th>

              {/* DOB */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("dob")}
              >
                <div className="flex items-center gap-1">
                  DOB
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sortOrder === "ASC" ? (
                      <ArrowUp size={14} className="text-gray-700" />
                    ) : (
                      <ArrowDown size={14} className="text-gray-700" />
                    )}
                  </span>
                </div>
              </th>

              {/* Gender */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Show skeleton rows during initial load or hard refresh
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No students found
                </td>
              </tr>
            ) : (
              // Real data
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.student_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.name_kh}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.name_en}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(student.dob)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.gender === "Male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {student.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.section}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.program}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewStudent(student.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Open Modal */}
      {selectedStudentId && (
        <StudentViewDetail
          studentId={selectedStudentId}
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
            <span>of {meta.total} students</span>
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
              {/* Generate page numbers based on meta.total and meta.limit */}
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
