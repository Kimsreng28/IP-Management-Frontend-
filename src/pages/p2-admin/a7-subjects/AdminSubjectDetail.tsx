"use client";

import { useEffect, useState } from "react";
import {
  X,
  BookOpen,
  Hash,
  Clock,
  GraduationCap,
  Users,
  Calendar,
} from "lucide-react";
import { useSubjectStore } from "../../../stores/useSubjectStore";

interface SubjectDetailProps {
  subjectId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SubjectDetailData {
  id: string;
  code: string;
  name: string;
  description?: string;
  total_hours: number;
  credits: number;
  program_name: string;
  program_id: number;
  teacher_name?: string;
  teacher_code?: string;
  teacher_info_id?: string;
  semester_names: string[];
  teacher?: {
    id: string;
    code: string;
    name: string;
    email: string;
    department: string;
  };
  teachers?: Array<{
    id: string;
    code: string;
    name: string;
    email: string;
  }>;
  semesters?: Array<{
    id: number;
    name: string;
    semester_number: number;
    year_number: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

export default function AdminSubjectDetail({
  subjectId,
  isOpen,
  onClose,
}: SubjectDetailProps) {
  const [subject, setSubject] = useState<SubjectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchSubjectById } = useSubjectStore();

  useEffect(() => {
    if (isOpen && subjectId) {
      fetchSubjectDetail();
    }
  }, [isOpen, subjectId]);

  const fetchSubjectDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const subjectData = await fetchSubjectById(subjectId);

      if (subjectData) {
        setSubject(subjectData as SubjectDetailData);
      } else {
        setError("Failed to fetch subject details");
      }
    } catch (err) {
      setError("Failed to load subject details");
      console.error("Error fetching subject:", err);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#131C2E]" />
            <h2 className="text-2xl font-bold text-gray-900">Subject Detail</h2>
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
                onClick={fetchSubjectDetail}
                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
              >
                Try Again
              </button>
            </div>
          ) : subject ? (
            <div className="space-y-6">
              {/* Subject Header */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#131C2E] text-white">
                      {subject.code}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {subject.credits} credits
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                      {subject.total_hours} hours
                    </span>
                  </div>
                </div>

                {subject.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program Information */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#131C2E]" />
                    Program Information
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Program</p>
                        <p className="text-base font-medium text-gray-900">
                          {subject.program_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Information */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#131C2E]" />
                    Teacher Information
                  </h4>

                  <div className="space-y-3">
                    {subject.teacher_name ? (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Assigned Teacher</p>
                          <p className="text-base font-medium text-gray-900">
                            {subject.teacher_name} ({subject.teacher_code})
                          </p>
                          {subject.teacher?.email && (
                            <p className="text-sm text-gray-600">
                              {subject.teacher.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Teacher</p>
                          <p className="text-base font-medium text-gray-900 text-gray-400">
                            Not assigned
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Semesters Section */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#131C2E]" />
                  Assigned Semesters
                </h4>

                {subject.semester_names && subject.semester_names.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {subject.semester_names.map((semester, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {semester}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No semesters assigned</p>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Details */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-[#131C2E]" />
                    Subject Details
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Subject Code</p>
                        <p className="text-base font-medium text-gray-900">
                          {subject.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Total Hours</p>
                        <p className="text-base font-medium text-gray-900">
                          {subject.total_hours} hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Credits</p>
                        <p className="text-base font-medium text-gray-900">
                          {subject.credits} credits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {subject.created_at && (
                  <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#131C2E]" />
                      Metadata
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-base font-medium text-gray-900">
                          {formatDate(subject.created_at)}
                        </p>
                      </div>

                      {subject.updated_at && (
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(subject.updated_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}