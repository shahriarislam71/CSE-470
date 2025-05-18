import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeHover, setActiveHover] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/admin/add-student', name: 'Add Student', icon: '👨‍🎓' },
    { path: '/admin/add-teacher', name: 'Add Teacher', icon: '👩‍🏫' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 bg-white shadow-2xl z-10 border-r border-indigo-100"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Logo/Header */}
              <div className="mb-10">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  Education And Communication<span className="text-black"></span>
                </motion.h1>
                <p className="text-sm text-black mt-3">Control Center</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1">
                <ul className="space-y-3">
                  {navItems.map((item, index) => (
                    <motion.li 
                      key={item.path}
                      onHoverStart={() => setActiveHover(index)}
                      onHoverEnd={() => setActiveHover(null)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200'
                              : 'text-gray-800 hover:text-purple-700 font-medium'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {activeHover === index && !isActive && (
                              <motion.span 
                                className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              />
                            )}
                            <span className="mr-3 text-xl z-10">{item.icon}</span>
                            <span className="z-10">{item.name}</span>
                            {!isActive && (
                              <motion.span 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"
                                initial={{ width: 0 }}
                                animate={{ width: activeHover === index ? '100%' : 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            {isActive && (
                              <motion.span 
                                className="absolute right-4 w-2 h-2 bg-white rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-6 border-t border-purple-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    A
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Admin</p>
                    <p className="text-xs text-purple-400">Super Administrator</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-0">
          <div className="flex items-center justify-between p-5">
            <button
              onClick={toggleSidebar}
              className="p-3 rounded-xl hover:bg-purple-100 text-purple-600 transition-all duration-300 hover:scale-105"
            >
              {isSidebarOpen ? (
                <motion.span animate={{ rotate: 0 }}>◀</motion.span>
              ) : (
                <motion.span animate={{ rotate: 180 }}>▶</motion.span>
              )}
            </button>
            
            <div className="flex items-center space-x-6">
              <button className="p-3 rounded-xl hover:bg-purple-100 text-purple-600 transition-colors relative group">
                <span className="text-xl">🔔</span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-purple-600 group-hover:w-4/5 transition-all duration-300"></span>
              </button>
              
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md flex items-center justify-center text-white font-bold">
                  A
                </div>
                <motion.div 
                  className="text-gray-800 font-medium"
                  whileHover={{ color: '#7C3AED' }}
                >
                  Admin Panel
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white to-indigo-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;