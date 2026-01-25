
"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar, BookOpen, ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";
import { useSemesterStore } from "../../../../stores/useSemesterStore";
import SemesterCreateModal from "./AdminCreateSemester";
import SemesterEditModal from "./AdminUpdateSemester";

interface ProgramSemestersProps {
  programId: number;
  programName: string;
}

export default function ProgramSemesters({ programId, programName }: ProgramSemestersProps) {
  const { 
    semesters, 
    dataSetup, 
    isLoading, 
    fetchSemestersByProgram, 
    deleteSemester 
  } = useSemesterStore();
  
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<string | null>(null);

  useEffect(() => {
    fetchSemestersByProgram(programId);
  }, [programId]);

  const handleDelete = async (semesterId: string) => {
    if (window.confirm("Are you sure you want to delete this semester?")) {
      await deleteSemester(programId, semesterId);
    }
  };

  // Group semesters by year
  const semestersByYear = semesters.reduce((acc, semester) => {
    const year = semester.year_number;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(semester);
    return acc;
  }, {} as Record<number, typeof semesters>);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchSemestersByProgram(programId);
  };

  const handleEditSuccess = () => {
    setEditingSemester(null);
    fetchSemestersByProgram(programId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Semesters for {programName}</h2>
          <p className="text-gray-600">Manage academic semesters for this program</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#131C2E] text-white font-medium rounded-lg hover:bg-[#1B2742] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Semester
        </button>
      </div>

      {/* Data Setup Info */}
      {dataSetup && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-1">Available Subjects</h3>
            <p className="text-2xl font-bold text-blue-600">{dataSetup.subjects.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-1">Academic Years</h3>
            <p className="text-2xl font-bold text-green-600">{dataSetup.academic_years.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-1">Total Semesters</h3>
            <p className="text-2xl font-bold text-purple-600">{semesters.length}</p>
          </div>
        </div>
      )}

      {/* Semesters List */}
      <div className="space-y-4">
        {Object.entries(semestersByYear)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([year, yearSemesters]) => (
            <div key={year} className="border rounded-lg overflow-hidden">
              {/* Year Header */}
              <div
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onClick={() => setExpandedYear(expandedYear === Number(year) ? null : Number(year))}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Year {year} ({yearSemesters.length} semesters)
                  </h3>
                </div>
                {expandedYear === Number(year) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Year Semesters */}
              {expandedYear === Number(year) && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearSemesters
                      .sort((a, b) => a.semester_number - b.semester_number)
                      .map((semester) => (
                        <div
                          key={semester.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{semester.name}</h4>
                              <p className="text-sm text-gray-600">
                                Semester {semester.semester_number}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              semester.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {semester.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(semester.start_date).toLocaleDateString()} - 
                              {new Date(semester.end_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <BookOpen className="w-4 h-4 mr-2" />
                              {semester.subjects_count} subjects
                            </div>
                            <div className="text-sm text-gray-600">
                              Academic Year: {semester.academic_year_name}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-3 border-t">
                            <button
                              onClick={() => setEditingSemester(semester.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(semester.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Empty State */}
      {semesters.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No semesters yet</h3>
          <p className="text-gray-600 mb-6">
            Add semesters to organize the academic schedule for this program.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#131C2E] text-white font-medium rounded-lg hover:bg-[#1B2742] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Semester
          </button>
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && dataSetup && (
        <SemesterCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          programId={programId}
          dataSetup={dataSetup}
          onCreateSuccess={handleCreateSuccess}
        />
      )}

      {editingSemester && dataSetup && (
        <SemesterEditModal
          isOpen={!!editingSemester}
          onClose={() => setEditingSemester(null)}
          programId={programId}
          semesterId={editingSemester}
          dataSetup={dataSetup}
          onEditSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}