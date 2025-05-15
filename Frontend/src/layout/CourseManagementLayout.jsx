import { useState } from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiMessageSquare, 
  FiFileText, 
  FiVideo, 
  FiFile, 
  FiPlusCircle,
  FiChevronDown,
  FiChevronRight,
  FiUserPlus
} from 'react-icons/fi';

const CourseManagementLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sections, setSections] = useState([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const { courseId } = useParams();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (sectionId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded } 
        : section
    ));
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    
    const newSectionId = `sec${Date.now()}`;
    const newSection = {
      id: newSectionId,
      name: newSectionName,
      isExpanded: false,
      items: [
        { path: `/teacher/courses/${courseId}/sections/${newSectionId}/announcements`, name: 'Announcements', icon: <FiMessageSquare /> },
        { path: `/teacher/courses/${courseId}/sections/${newSectionId}/students`, name: 'Students', icon: <FiUsers /> },
        { path: `/teacher/courses/${courseId}/sections/${newSectionId}/add-students`, name: 'Add Students', icon: <FiUserPlus /> },
        { path: `/teacher/courses/${courseId}/sections/${newSectionId}/chatrooms`, name: 'Chatrooms', icon: <FiMessageSquare /> },
        { path: `/teacher/courses/${courseId}/sections/${newSectionId}/assignments`, name: 'Assignments', icon: <FiFileText /> }
      ]
    };
    
    setSections([...sections, newSection]);
    setNewSectionName('');
    setShowAddSectionModal(false);
  };

  const navItems = [
    { 
      path: `/teacher/courses/${courseId}/overview`, 
      name: 'Overview', 
      icon: <FiHome />,
      exact: true
    },
    { 
      path: `/teacher/courses/${courseId}/materials`, 
      name: 'Course Materials', 
      icon: <FiBook />,
      subItems: [
        { path: `/teacher/courses/${courseId}/materials/videos`, name: 'Videos', icon: <FiVideo /> },
        { path: `/teacher/courses/${courseId}/materials/notes`, name: 'Lecture Notes', icon: <FiFile /> },
        { path: `/teacher/courses/${courseId}/materials/practice`, name: 'Practice Sheets', icon: <FiFileText /> }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-indigo-50 overflow-hidden">
      {/* Add Section Modal */}
      <AnimatePresence>
        {showAddSectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Create New Section</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Section Name</label>
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter section name"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddSectionModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSection}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="mb-8">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  Course Dashboard
                </motion.h1>
                <p className="text-sm text-purple-400 mt-1">Manage your course content</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.path || item.name} className="group">
                      {item.path ? (
                        <NavLink
                          to={item.path}
                          end={item.exact}
                          className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                              isActive
                                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-l-4 border-purple-600 font-semibold'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                            }`
                          }
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          <span>{item.name}</span>
                        </NavLink>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleSection(item.name.toLowerCase())}
                            className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
                          >
                            <div className="flex items-center">
                              <span className="mr-3 text-lg">{item.icon}</span>
                              <span>{item.name}</span>
                            </div>
                            <FiChevronDown className="text-gray-500" />
                          </button>
                          
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-10 pl-2 border-l-2 border-purple-100 overflow-hidden"
                            >
                              {item.subItems.map((subItem) => (
                                <NavLink
                                  key={subItem.path}
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    `flex items-center py-2 px-3 text-sm rounded-md transition-all ${
                                      isActive
                                        ? 'bg-purple-50 text-purple-600 font-medium'
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                                    }`
                                  }
                                >
                                  <span className="mr-2">{subItem.icon}</span>
                                  <span>{subItem.name}</span>
                                </NavLink>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        </>
                      )}
                    </li>
                  ))}

                  {/* Sections */}
                  <li className="mt-6">
                    <div className="flex items-center justify-between px-3 py-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Sections</h3>
                      <button 
                        onClick={() => setShowAddSectionModal(true)}
                        className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                        title="Add new section"
                      >
                        <FiPlusCircle />
                      </button>
                    </div>
                  </li>

                  {sections.map((section) => (
                    <li key={section.id} className="group">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
                      >
                        <div className="flex items-center">
                          <FiBook className="mr-3 text-lg" />
                          <span>{section.name}</span>
                        </div>
                        {section.isExpanded ? (
                          <FiChevronDown className="text-gray-500" />
                        ) : (
                          <FiChevronRight className="text-gray-500" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {section.isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-10 pl-2 border-l-2 border-purple-100 overflow-hidden"
                          >
                            {section.items.map((item) => (
                              <NavLink
                                key={`${section.id}-${item.path}`}
                                to={item.path}
                                className={({ isActive }) =>
                                  `flex items-center py-2 px-3 text-sm rounded-md transition-all ${
                                    isActive
                                      ? 'bg-purple-50 text-purple-600 font-medium'
                                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                                  }`
                                }
                              >
                                <span className="mr-2">{item.icon}</span>
                                <span>{item.name}</span>
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
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
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                    <FiPlusCircle />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Quick Actions</p>
                    <p className="text-xs text-purple-400">Create new content</p>
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
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-all duration-300 hover:scale-105"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors">
                  <FiMessageSquare className="text-xl" />
                </button>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md flex items-center justify-center text-white text-sm font-bold">
                  T
                </div>
                <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                  Teacher
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-white to-indigo-50">
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

export default CourseManagementLayout;