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
import { useSubjectStore } from "../../../stores/useSubjectStore";
import toast from "react-hot-toast";
import AdminUpdateSubject from "./AdminUpdateSubject";
import AdminCreateSubject from "./AdminCreateSubject";
import AdminSubjectDetail from "./AdminSubjectDetail";

// You can create these components later

export default function AdminSubjects() {
  const {
    // Data
    subjects,
    programs,
    meta,

    // UI State
    isLoading,

    // Filters
    filters,

    // Actions
    fetchSubjects,
    deleteSubject,

    // Filter management
    setFilter,
    resetFilters,

    // Pagination
    goToPage,
    setItemsPerPage,
  } = useSubjectStore();

  // Handle clear filters
  const handleClearFilters = () => {
    resetFilters();
  };

  // State variables inside the AdminSubjects component
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Add handlers for opening/closing the update modal
  const handleEditSubject = (subjectId: string) => {
    setEditingSubjectId(subjectId);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setEditingSubjectId(null);
  };

  // Add handlers for opening/closing the modal
  const handleViewSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedSubjectId(null);
  };

  // Handle delete subject
  const handleDeleteSubject = async (
    id: string,
    code: string,
    name: string
  ) => {
    const message = `Are you sure you want to delete this subject?\n\n${code} - ${name}`;

    if (confirm(message)) {
      try {
        await deleteSubject(id);
      } catch (error) {
        console.error("Failed to delete subject:", error);
        toast.error("Failed to delete subject");
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Debounced search and filter updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSubjects();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    filters.search,
    filters.program,
    filters.sort_by,
    filters.sort_order,
    filters.page,
    filters.limit,
  ]);

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[...Array(5)].map((_, i) => (
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

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter("program", e.target.value);
  };

  // Handle column sorting
  const handleSort = (column: "code" | "name" | "credits" | "total_hours") => {
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
              placeholder="Search by code or name..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
     focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E]
     text-base placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
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
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
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
              min-w-[200px]
            "
          >
            <option value="">All Programs</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
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
              {/* Subject Code */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("code")}
              >
                <div className="flex items-center gap-1">
                  Code
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "code" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Subject Name */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Subject Name
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "name" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Total Hours */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("total_hours")}
              >
                <div className="flex items-center gap-1">
                  Total Hours
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "total_hours" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Credits */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("credits")}
              >
                <div className="flex items-center gap-1">
                  Credits
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "credits" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Program */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Program
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
            ) : subjects.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No subjects found
                </td>
              </tr>
            ) : (
              // Real data
              subjects.map((subject) => (
                <tr
                  key={subject.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {subject.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {subject.total_hours} hours
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subject.credits} credits
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {subject.program_name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewSubject(subject.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEditSubject(subject.id)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteSubject(
                            subject.id,
                            subject.code,
                            subject.name
                          )
                        }
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

      {/* Open Subject Model */}
      {selectedSubjectId && (
        <AdminSubjectDetail
          subjectId={selectedSubjectId}
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}

      {/* Create Subject Modal */}
      <AdminCreateSubject
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchSubjects();
          setCreateModalOpen(false);
        }}
      />

      {/* Update Subject Modal */}
      {editingSubjectId && (
        <AdminUpdateSubject
          subjectId={editingSubjectId}
          isOpen={updateModalOpen}
          onClose={handleCloseUpdateModal}
          onSuccess={() => {
            fetchSubjects();
          }}
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
            <span>of {meta.total} subjects</span>
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