"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Plus, Search } from "lucide-react";
import { useDepartmentStore } from "../../../stores/useDepartmentStore";
import toast from "react-hot-toast";
import AdminDepartmentDetail from "./AdminDepartmentDetail";
import AdminDepartmentCreate from "./AdminDepartmentCreate";

// Import modals (you'll need to create these)
// import DepartmentViewDetail from "./AdminDepartmentDetail";
// import AdminCreateDepartment from "./AdminCreateDepartment";
// import AdminUpdateDepartment from "./AdminUpdateDepartment";

export default function AdminDepartments() {
  const {
    // Data
    departments,
    meta,

    // UI State
    isLoading,

    // Filters
    filters,

    // Actions
    fetchDepartments,
    deleteDepartment,

    // Filter management
    setFilter,

    // Pagination
    goToPage,
    setItemsPerPage,
  } = useDepartmentStore();

  // State for modals (commented out for now)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [, setUpdateModalOpen] = useState(false);
  const [, setEditingDepartmentId] = useState<number | null>(
    null
  );

  // Add handlers for opening/closing the view modal
  const handleViewDepartment = (departmentId: number) => {
    setSelectedDepartmentId(departmentId);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedDepartmentId(null);
  };

  // Handle edit button click from detail modal
  const handleEditFromDetail = () => {
    if (selectedDepartmentId) {
      handleCloseViewModal(); // Close detail modal
      setEditingDepartmentId(selectedDepartmentId);
      setUpdateModalOpen(true);
    }
  };

  // Handle delete department
  const handleDeleteDepartment = async (
    id: number,
    name: string,
    description: string
  ) => {
    const message = `Are you sure you want to delete this department?\n\n${name}\n${description}`;

    if (confirm(message)) {
      try {
        await deleteDepartment(id);
      } catch (error) {
        console.error("Failed to delete department:", error);
        toast.error("Failed to delete department");
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Debounced search and filter updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDepartments();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.page, filters.limit]);

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[...Array(4)].map((_, i) => (
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
              placeholder="Search by department name"
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
              <span>Add Department</span>
            </button>
          </div>
        </div>

        {/* Clear Filters Button
        <div className="flex justify-end">
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
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* ID */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>

              {/* Department Name */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Department Name
              </th>

              {/* Description */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
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
            ) : departments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No departments found
                </td>
              </tr>
            ) : (
              // Real data
              departments.map((department) => (
                <tr
                  key={department.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {department.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {department.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {department.description}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDepartment(department.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteDepartment(
                            department.id,
                            department.name,
                            department.description
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


      {/* Department Detail Modal */}
      {selectedDepartmentId && (
        <AdminDepartmentDetail
          departmentId={selectedDepartmentId}
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
          onEditClick={handleEditFromDetail}
        />
      )}

      <AdminDepartmentCreate
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSuccess={() => {
          setCreateModalOpen(false);
          fetchDepartments(); // Refresh the list after creation
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
            <span>of {meta.total} departments</span>
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
