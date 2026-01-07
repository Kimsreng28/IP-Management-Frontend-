// components/admin/programs/AdminPrograms.tsx
"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Plus, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useProgramStore } from "../../../stores/useProgramStore";
import AdminProgramCreate from "./AdminProgramCreate";

export default function AdminPrograms() {
  const {
    // Data
    programs,
    departments,
    degreeLevels,
    meta,

    // UI State
    isLoading,
    isFetching,

    // Filters
    filters,

    // Actions
    fetchPrograms,
    deleteProgram,

    // Filter management
    setFilter,
    resetFilters,

    // Pagination
    goToPage,
    setItemsPerPage,
  } = useProgramStore();

  // State for modals
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Handle clear filters
  const handleClearFilters = () => {
    resetFilters();
  };

  // Handle delete program
  const handleDeleteProgram = async (id: string, name: string) => {
    const message = `Are you sure you want to delete this program?\n\n${name}`;

    if (confirm(message)) {
      try {
        await deleteProgram(id);
      } catch (error) {
        console.error("Failed to delete program:", error);
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Debounced search and filter updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPrograms();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    filters.search,
    filters.page,
    filters.limit,
    filters.department,
    filters.degree_lvl,
    filters.sort_by,
    filters.sort_order,
  ]);

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter("search", e.target.value);
  };

  // Handle filter changes
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter("department", value ? value : undefined);
  };
  const handleDegreeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter("degree_lvl", value ? Number(value) : undefined);
  };
  // Get degree level label
  const getDegreeLevelLabel = (value: number) => {
    const level = degreeLevels.find((l) => l.value === value);
    return level ? level.label : `Level ${value}`;
  };

  // Handle column sorting (only for name and duration)
  const handleSort = (column: "name" | "duration") => {
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
              placeholder="Search by program name"
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
              <span>Add Program</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Department Filter */}
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
              min-w-[200px]
            "
          >
            <option value="">Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Degree Level Filter */}
          <select
            value={filters.degree_lvl?.toString() || ""}
            onChange={handleDegreeLevelChange}
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
            <option value="">Degree Levels</option>
            {degreeLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
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
              {/* No. */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                No.
              </th>

              {/* Program Name */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Program Name
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

              {/* Degree Level - No Sorting */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Degree Level
              </th>

              {/* Duration */}
              <th
                className="group px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("duration")}
              >
                <div className="flex items-center gap-1">
                  Duration (Years)
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {filters.sort_by === "duration" &&
                      (filters.sort_order === "ASC" ? (
                        <ArrowUp size={14} className="text-gray-700" />
                      ) : (
                        <ArrowDown size={14} className="text-gray-700" />
                      ))}
                  </span>
                </div>
              </th>

              {/* Department - No Sorting */}
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
            {isLoading || isFetching ? (
              // Show skeleton rows during loading
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : programs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No programs found
                </td>
              </tr>
            ) : (
              // Real data with sequential numbering
              programs.map((program, index) => {
                // Calculate the sequential number based on current page and index
                const sequentialNumber =
                  ((filters.page || 1) - 1) * (filters.limit || 10) + index + 1;

                return (
                  <tr
                    key={program.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {sequentialNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {program.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {getDegreeLevelLabel(program.degree_lvl)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {program.duration} year
                        {program.duration !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {program.department_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            /* Add view functionality */
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            /* Add edit functionality */
                          }}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteProgram(program.id, program.name)
                          }
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Program Create Modal */}
      <AdminProgramCreate
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSuccess={() => {
          setCreateModalOpen(false);
          fetchPrograms(); // Refresh the list after creation
        }}
      />

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
            <span>of {meta.total} programs</span>
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
