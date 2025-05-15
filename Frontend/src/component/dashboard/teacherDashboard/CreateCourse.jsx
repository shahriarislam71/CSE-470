import { useState } from 'react';
import { motion } from 'framer-motion';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    facultyInitial: '',
    description: '',
    image: null,
    previewImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          previewImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6">
          <h2 className="text-3xl font-bold text-white">Create New Course</h2>
          <p className="text-purple-100 mt-1">Fill in the details to create your course</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Image Upload */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-800">Course Image</label>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-purple-200 group-hover:border-purple-400 transition-all duration-300">
                  {formData.previewImage ? (
                    <img 
                      src={formData.previewImage} 
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
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Upload a high-quality image that represents your course (JPEG, PNG). Recommended size: 800x450px.</p>
              </div>
            </div>
          </div>

          {/* Course Name */}
          <div className="space-y-2">
            <label htmlFor="courseName" className="block text-lg font-medium text-gray-800">
              Course Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                placeholder="Introduction to Computer Science"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">📚</span>
              </div>
            </div>
          </div>

          {/* Course Code & Faculty Initial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="courseCode" className="block text-lg font-medium text-gray-800">
                Course Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                  placeholder="CS101"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">🔢</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="facultyInitial" className="block text-lg font-medium text-gray-800">
                Faculty Initial <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="facultyInitial"
                  name="facultyInitial"
                  value={formData.facultyInitial}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                  placeholder="e.g. JS"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">👨‍🏫</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-lg font-medium text-gray-800">
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
              placeholder="Describe what students will learn in this course..."
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <motion.button
              type="button"
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Course
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateCourse;