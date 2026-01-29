import { useEffect, useMemo } from "react";
import { useStudentStore } from "../../stores/useStudentStore";
import { useTeacherStore } from "../../stores/useTeacherStore";
import { useHodStore } from "../../stores/useHodStore";

import HalfDoughnutChart from "../../components/charts/Half-donut";
import StaffOverviewBarChart from "../../components/charts/StaffOverViewBarChart";

const AdminDashboard = () => {
  const { students, fetchStudents } = useStudentStore();
  const { teachers, fetchTeachers } = useTeacherStore();
  const { hods, fetchHods } = useHodStore();

  useEffect(() => {
    fetchStudents({ limit: 1000 });
    fetchTeachers({ limit: 1000 });
    fetchHods({ limit: 1000 });
  }, [fetchStudents, fetchTeachers, fetchHods]);

  // 🔹 Student gender stats
  const { maleCount, femaleCount } = useMemo(() => {
    let male = 0;
    let female = 0;

    students.forEach((s) => {
      if (s.gender === "Male") male++;
      if (s.gender === "Female") female++;
    });

    return { maleCount: male, femaleCount: female };
  }, [students]);

  // 🔹 Overview stats for bar chart
  const overviewStats = useMemo(() => {
    return {
      studentCount: students.length,
      teacherCount: teachers.length,
      hodCount: hods.length,
    };
  }, [students, teachers, hods]);

  return (
    <div className="p-5">
      {/* Dashboard header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of student statistics and analytics
        </p>
      </div>

      {/* Dashboard grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gender Doughnut */}
        <div className="p-6 border border-gray-300 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">
              Student Gender Distribution
            </h2>
          </div>

          <HalfDoughnutChart
            maleCount={maleCount}
            femaleCount={femaleCount}
          />

          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full" />
              Male: {maleCount}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-pink-500 rounded-full" />
              Female: {femaleCount}
            </div>
          </div>
        </div>

        {/* Staff & Student Overview Bar Chart */}
        <div className="p-6 border border-gray-300 rounded-lg shadow-md md:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Staff & Student Overview
            </h2>
            <p className="text-sm text-gray-500">
              Total number of students, teachers, and heads of department
            </p>
          </div>

          <StaffOverviewBarChart {...overviewStats} />
        </div>

        {/* Remaining placeholders */}
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart 2 - Coming soon</p>
        </div>

        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart 3 - Coming soon</p>
        </div>

        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart 5 - Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
