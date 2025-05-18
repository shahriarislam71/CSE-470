import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiBook, 
  FiClock, 
  FiTrash2, 
  FiCheck, 
  FiX,
  FiPlus,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";

const SectionStudents = () => {
  const { sectionName } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/section-students?section=${encodeURIComponent(sectionName)}`
        );
        setStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchStudents();
  }, [sectionName, isRefreshing]);

  // Handle student removal
  const handleRemoveStudent = async (studentId) => {
    try {
      const result = await Swal.fire({
        title: 'Remove Student?',
        text: "This will remove the student from this section.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7c3aed',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, remove!',
        background: '#1f2937',
        color: '#f9fafb',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/section-students/${studentId}`);
        setStudents(students.filter(student => student._id !== studentId));
        
        Swal.fire({
          title: 'Removed!',
          text: 'Student has been removed from this section.',
          icon: 'success',
          confirmButtonColor: '#7c3aed',
          background: '#1f2937',
          color: '#f9fafb',
        });
      }
    } catch (err) {
      console.error("Error removing student:", err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to remove student from section.',
        icon: 'error',
        confirmButtonColor: '#7c3aed',
        background: '#1f2937',
        color: '#f9fafb',
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/section-students/${studentId}`, {
        status: newStatus
      });
      
      setStudents(students.map(student => 
        student._id === studentId ? { ...student, status: newStatus } : student
      ));
    } catch (err) {
      console.error("Error updating student status:", err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update student status.',
        icon: 'error',
        confirmButtonColor: '#7c3aed',
        background: '#1f2937',
        color: '#f9fafb',
      });
    }
  };

  // Filter students based on search term and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.section.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Refresh data
  const refreshData = () => {
    setIsRefreshing(true);
  };

  // Loading state
  if (loading && !isRefreshing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <PulseLoader color="#8b5cf6" size={15} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-900/50 border-l-4 border-red-500 p-6 max-w-md w-full">
          <div className="flex items-center">
            <div className="ml-4">
              <h3 className="text-xl font-bold text-red-100">Error Loading Data</h3>
              <p className="text-red-200 mt-1">{error}</p>
              <button
                onClick={refreshData}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white flex items-center"
              >
                <FiRefreshCw className="mr-2" /> Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              {decodeURIComponent(sectionName)} Students
            </h1>
            <p className="text-gray-400 mt-1">
              Manage all students in this section
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isRefreshing
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-800 hover:bg-gray-700 text-purple-300'
              } transition-colors`}
            >
              <FiRefreshCw className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center space-x-2 transition-colors">
              <FiDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-white">{students.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-900/30 text-purple-400">
                <FiUser size={20} />
              </div>
            </div>
          </div>
          
          {/* Active Students */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-400">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-900/30 text-green-400">
                <FiCheck size={20} />
              </div>
            </div>
          </div>
          
          {/* Pending Students */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {students.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-900/30 text-yellow-400">
                <FiClock size={20} />
              </div>
            </div>
          </div>
          
          {/* Add New Student */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-colors cursor-pointer">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-sm text-gray-400">Add Student</p>
                <p className="text-lg font-medium text-purple-300">New Enrollment</p>
              </div>
              <div className="p-3 rounded-full bg-purple-900/30 text-purple-400">
                <FiPlus size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search students by email or section..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-500" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiUser className="text-gray-600 text-4xl mb-3" />
                        <h3 className="text-lg font-medium text-gray-300">
                          {students.length === 0 ? 'No students in this section yet' : 'No students match your search'}
                        </h3>
                        <p className="text-gray-500 mt-1">
                          {students.length === 0 ? 'Add students to get started' : 'Try a different search term'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredStudents.map((student) => (
                      <motion.tr 
                        key={student._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-800/70"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                              <FiUser className="text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {student.email.split('@')[0]}
                              </div>
                              <div className="text-xs text-gray-400">
                                {student.section}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'active' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(student.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {student.status === 'pending' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(student._id, 'active')}
                                className="p-2 text-green-400 hover:text-green-300 rounded-full hover:bg-green-900/30 transition-colors"
                                title="Approve student"
                              >
                                <FiCheck size={18} />
                              </motion.button>
                            )}
                            {student.status === 'active' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(student._id, 'pending')}
                                className="p-2 text-yellow-400 hover:text-yellow-300 rounded-full hover:bg-yellow-900/30 transition-colors"
                                title="Mark as pending"
                              >
                                <FiX size={18} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveStudent(student._id)}
                              className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/30 transition-colors"
                              title="Remove student"
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionStudents;