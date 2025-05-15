import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../../../context/AuthProvider";
import axios from "axios";
import { 
  FiEdit, 
  FiTrash2, 
  FiClock, 
  FiBook, 
  FiUser, 
  FiCode,
  FiX,
  FiSave,
  FiUpload,
  FiArrowRight
} from "react-icons/fi";

const CreatedCourseSection = () => {
  const { users } = useContext(Authcontext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({
    courseName: '',
    courseCode: '',
    facultyInitial: '',
    description: '',
    imageUrl: '',
    currentImageUrl: ''
  });
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      try {
        if (!users?.email) return;
        
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/courses/created-by-user", 
          { params: { email: users.email } }
        );
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedCourses();
  }, [users?.email]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

  const handleEdit = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${courseId}`);
      const course = response.data;
      
      setEditingCourse(courseId);
      setEditFormData({
        courseName: course.courseName,
        courseCode: course.courseCode,
        facultyInitial: course.facultyInitial,
        description: course.description || '',
        imageUrl: course.imageUrl,
        currentImageUrl: course.imageUrl
      });
      setEditPreviewImage(course.imageUrl);
    } catch (err) {
      console.error("Error fetching course for edit:", err);
      alert("Failed to load course for editing");
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/teacher/courses/${courseId}`);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image to server
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setEditFormData(prev => ({
        ...prev,
        imageUrl: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editFormData.courseName || !editFormData.courseCode || !editFormData.facultyInitial) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/courses/${editingCourse}`,
        editFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update the courses list
      setCourses(courses.map(course => 
        course._id === editingCourse ? response.data.course : course
      ));

      // Reset edit state
      setEditingCourse(null);
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const cancelEdit = () => {
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <FiBook className="text-purple-500 text-3xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No courses created yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first course.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Created Courses</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
        </span>
      </div>

      <AnimatePresence>
        {editingCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Edit Course</h3>
                  <button 
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  {/* Course Image Upload */}
                  <div className="space-y-4">
                    <label className="block text-lg font-medium text-gray-800">Course Image</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-purple-200 group-hover:border-purple-400 transition-all duration-300">
                          {editPreviewImage ? (
                            <img 
                              src={editPreviewImage} 
                              alt="Course preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <span className="text-4xl">📷</span>
                              <p className="text-xs text-purple-400 mt-1">Upload Image</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          disabled={isUploadingImage}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {isUploadingImage ? 'Uploading image...' : 'Upload a new image or keep the existing one'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Course Name */}
                  <div className="space-y-2 mt-4">
                    <label htmlFor="editCourseName" className="block text-lg font-medium text-gray-800">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="editCourseName"
                      name="courseName"
                      value={editFormData.courseName}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                      placeholder="Introduction to Computer Science"
                    />
                  </div>

                  {/* Course Code & Faculty Initial */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="editCourseCode" className="block text-lg font-medium text-gray-800">
                        Course Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="editCourseCode"
                        name="courseCode"
                        value={editFormData.courseCode}
                        onChange={handleEditChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="CS101"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="editFacultyInitial" className="block text-lg font-medium text-gray-800">
                        Faculty Initial <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="editFacultyInitial"
                        name="facultyInitial"
                        value={editFormData.facultyInitial}
                        onChange={handleEditChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="e.g. JS"
                      />
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="space-y-2 mt-4">
                    <label htmlFor="editDescription" className="block text-lg font-medium text-gray-800">
                      Course Description
                    </label>
                    <textarea
                      id="editDescription"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                      placeholder="Describe what students will learn in this course..."
                    ></textarea>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <motion.button
                      type="button"
                      onClick={cancelEdit}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isUploadingImage}
                      className={`px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FiSave className="mr-2" />
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleCourseClick(course._id)}
          >
            <div className="relative h-40 bg-gradient-to-r from-purple-400 to-purple-600">
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">{course.courseName}</h3>
                <p className="text-purple-200">{course.courseCode}</p>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <FiArrowRight className="text-white" />
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 line-clamp-3 mb-4">{course.description}</p>
              
              <div className="space-y-3 text-sm text-gray-500 mb-5">
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  <span>Faculty: {course.facultyInitial}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>Created: {formatDate(course.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <FiCode className="mr-2" />
                  <span>Status: <span className="capitalize">{course.status}</span></span>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(course._id);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FiEdit className="mr-2" />
                  Edit
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(course._id);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CreatedCourseSection;