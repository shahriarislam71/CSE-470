import { motion } from 'framer-motion';
import { FiVideo, FiFile, FiFileText } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const CourseMaterials = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Course Materials</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NavLink
          to="materials/videos"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <FiVideo className="text-purple-600 text-2xl" />
          </div>
          <h3 className="font-medium text-gray-800">Videos</h3>
          <p className="text-sm text-gray-500 mt-1">Upload and manage course videos</p>
        </NavLink>
        
        <NavLink
          to="materials/notes"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiFile className="text-blue-600 text-2xl" />
          </div>
          <h3 className="font-medium text-gray-800">Lecture Notes</h3>
          <p className="text-sm text-gray-500 mt-1">Upload and manage lecture notes</p>
        </NavLink>
        
        <NavLink
          to="materials/practice"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiFileText className="text-green-600 text-2xl" />
          </div>
          <h3 className="font-medium text-gray-800">Practice Sheets</h3>
          <p className="text-sm text-gray-500 mt-1">Upload and manage practice materials</p>
        </NavLink>
      </div>
    </motion.div>
  );
};

export default CourseMaterials;