import { useEffect, useMemo } from "react";
import { useStudentStore } from "../../stores/useStudentStore";
import HalfDoughnutChart from "../../components/charts/Half-donut";

const AdminDashboard = () => {
  const { students, fetchStudents } = useStudentStore();

  useEffect(() => {
    fetchStudents({ limit: 1000 }); // get enough students
  }, [fetchStudents]);

  // derived data (cheap & reactive)
  const { maleCount, femaleCount } = useMemo(() => {
    let male = 0;
    let female = 0;

    students.forEach((s) => {
      if (s.gender === "Male") male++;
      if (s.gender === "Female") female++;
    });

    return { maleCount: male, femaleCount: female };
  }, [students]);

  return (
    <div className="p-5">
      {/* Dashboard header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of student statistics and analytics</p>
      </div>

      {/* Dashboard grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart section - takes ~1/3 of the page on medium screens and up */}
        <div className="p-6 border border-gray-300 rounded-lg shadow-md">
          {/* Title inside the container */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Student Gender Distribution</h2>
          </div>

          {/* Chart */}
          <HalfDoughnutChart
            maleCount={maleCount}
            femaleCount={femaleCount}
          />

          {/* Optional legend */}
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

        {/* Placeholder for other charts - they will auto-fill the remaining space */}
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart 2 - Coming soon</p>
        </div>
        
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart 3 - Coming soon</p>
        </div>
        
        {/* Additional row for more charts if needed */}
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px] md:col-span-2">
          <p className="text-gray-500">Wide chart - Coming soon</p>
        </div>
        
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart 5 - Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
