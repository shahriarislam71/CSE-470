import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers, FiBook, FiMessageSquare, FiFileText } from 'react-icons/fi';

const CourseOverview = () => {
  const stats = [
    { title: "Total Students", value: "142", icon: <FiUsers className="text-2xl" />, color: "text-purple-600" },
    { title: "Active Sections", value: "5", icon: <FiBook className="text-2xl" />, color: "text-indigo-600" },
    { title: "Announcements", value: "8", icon: <FiMessageSquare className="text-2xl" />, color: "text-blue-600" },
    { title: "Assignments", value: "12", icon: <FiFileText className="text-2xl" />, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Course Overview</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
          Quick Actions
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-opacity-20 ${stat.color.replace('text', 'bg')}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item * 0.1 }}
              className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <FiBarChart2 className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">New assignment added</h4>
                <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;