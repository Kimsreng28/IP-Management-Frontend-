"use client";

import { useState } from "react";
import { Eye, Edit2, Trash2, Plus, Search } from "lucide-react";

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Sample student data
  const students = [
    {
      id: "STU001",
      khmerName: "សុខ វិជិត្រា",
      latinName: "Sok Vichitra",
      dob: "15 Mar 2002",
      gender: "Female",
      department: "Computer Science",
      program: "Undergraduate",
      section: "A",
    },
    {
      id: "STU002",
      khmerName: "ចាន់ សុភាក",
      latinName: "Chan Sopheak",
      dob: "22 Aug 2001",
      gender: "Male",
      department: "Information Technology",
      program: "Undergraduate",
      section: "B",
    },
    {
      id: "STU003",
      khmerName: "លី សុវណ្ណារី",
      latinName: "Ly Sovannarey",
      dob: "08 Dec 2000",
      gender: "Female",
      department: "Business Administration",
      section: "A",
    },
    {
      id: "STU004",
      khmerName: "ពេជ្រ ដារ៉ា",
      latinName: "Pech Dara",
      dob: "30 Jun 2002",
      gender: "Male",
      department: "Engineering",
      section: "C",
    },
    {
      id: "STU005",
      khmerName: "ម៉ាលី ច័ន្ធី",
      latinName: "Maley Chanthy",
      dob: "18 Feb 2001",
      gender: "Female",
      department: "Computer Science",
      section: "B",
    },
    {
      id: "STU006",
      khmerName: "រ៉ត សុភា",
      latinName: "Roth Sophea",
      dob: "05 Nov 2001",
      gender: "Male",
      department: "Information Technology",
      section: "A",
    },
    {
      id: "STU007",
      khmerName: "ពិសាខ ស្រីម៉ៅ",
      latinName: "Pisach Sreymao",
      dob: "12 Sep 2000",
      gender: "Female",
      department: "Business Administration",
      section: "D",
    },
    {
      id: "STU008",
      khmerName: "វុធី រតនា",
      latinName: "Vuthy Ratana",
      dob: "27 Apr 2002",
      gender: "Male",
      department: "Engineering",
      section: "C",
    },
  ];

  const departments = [
    "Computer Science",
    "Information Technology",
    "Business Administration",
    "Engineering",
  ];
  const programs = ["Undergraduate", "Graduate"];
  const sections = ["A", "B", "C", "D"];
  const genders = ["Male", "Female"];

  const totalStudents = 156;

  const handleClearFilters = () => {
    setSelectedDepartment("");
    setSelectedProgram("");
    setSelectedSection("");
    setSelectedGender("");
    setSearchQuery("");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    }
  };

  // Function to filter students based on selected criteria
  const filteredStudents = students.filter((student) => {
    return (
      (!selectedDepartment || student.department === selectedDepartment) &&
      (!selectedProgram || student.program === selectedProgram) &&
      (!selectedSection || student.section === selectedSection) &&
      (!selectedGender || student.gender === selectedGender) &&
      (student.id.includes(searchQuery) ||
        student.khmerName.includes(searchQuery) ||
        student.latinName.includes(searchQuery))
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                 text-base placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Add Student Button */}
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
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
    "
          >
            <option value="">Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
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
    "
          >
            <option value="">Program</option>
            {programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
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
    "
          >
            <option value="">Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
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
                  checked={selectedStudents.length === students.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Khmer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Latin Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                DOB
              </th>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) =>
                      handleSelectStudent(student.id, e.target.checked)
                    }
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {student.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.khmerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.latinName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.dob}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.gender}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.department}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                  {student.section}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4">
        {/* Left: items per page */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Showing</span>
          <select
            value={itemsPerPage}
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
          <span>of {totalStudents} students</span>
        </div>

        {/* Right: pagination controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
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
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg font-medium transition-colors text-sm ${
                  currentPage === page
                    ? "bg-[#131C2E] text-white"
                    : "text-[#131C2E] bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="flex items-center px-2 text-gray-500">...</span>

            <button
              onClick={() => setCurrentPage(16)}
              className={`w-9 h-9 rounded-lg font-medium transition-colors text-sm ${
                currentPage === 16
                  ? "bg-[#131C2E] text-white"
                  : "text-[#131C2E] bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              16
            </button>
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="
        px-3 py-1.5
        text-[#131C2E]
        bg-white
        border border-gray-300
        rounded-lg
        hover:bg-gray-100
        transition-colors
        text-sm
      "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
