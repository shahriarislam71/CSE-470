import { useContext } from "react";
import { AiFillHome } from "react-icons/ai";
import { BiBook, BiGroup, BiMessageDetail } from "react-icons/bi";
import { BsPersonLinesFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { MdSchool, MdLogout, MdAnnouncement } from "react-icons/md";
import { HiAcademicCap } from "react-icons/hi";
import { FaBookmark, FaPlus } from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Authcontext } from "../context/AuthProvider";
import { motion } from "framer-motion";

const StudentDashboard = () => {
    const { users, loading, logOut } = useContext(Authcontext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (logOut) {
            logOut()
                .then(() => {
                    navigate("/");
                })
                .catch((error) => console.error(error));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    const sidebarVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                staggerChildren: 0.1,
                duration: 0.5,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                <Outlet />
                <label
                    htmlFor="my-drawer-2"
                    className="btn bg-purple-600 hover:bg-purple-700 text-white drawer-button lg:hidden fixed top-4 left-4 z-50 shadow-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </label>
            </div>

            <div className="drawer-side z-40">
                <label
                    htmlFor="my-drawer-2"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>

                <motion.ul
                    className="background rounded-lg menu sidebar text-base-content min-h-full w-80 p-4 shadow-xl"
                    initial="hidden"
                    animate="visible"
                    variants={sidebarVariants}
                >
                    {/* Education Icon at the Top Center */}
                    <motion.div
                        className="flex flex-col items-center py-6 mb-6"
                        variants={itemVariants}
                    >
                        <div className="p-3 bg-white rounded-full shadow-lg mb-3">
                            <MdSchool className="text-5xl text-purple-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">
                            Learning Hub
                        </h2>
                    </motion.div>

                    {/* Sidebar Content */}
                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home"
                            end
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <AiFillHome className="text-xl" />
                            <span>Dashboard</span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/course"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <HiAcademicCap className="text-xl" />
                            <span>Courses</span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/chatrooms"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <BiMessageDetail className="text-xl" />
                            <span>Chatrooms</span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/connect"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <BsPersonLinesFill className="text-xl" />
                            <span>Connect</span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/announcements"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <MdAnnouncement className="text-xl" />
                            <span>Announcements</span>
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                7
                            </span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/saved-resources"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <FaBookmark className="text-xl" />
                            <span>Saved Resources</span>
                            <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                3
                            </span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/contribute-resources"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <FaPlus className="text-xl" />
                            <span>Contribute Resources</span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/inbox"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <BiBook className="text-xl" />
                            <span>Inbox</span>
                        </NavLink>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                        <NavLink
                            to="/home/group"
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? "font-bold text-white bg-purple-800/60 backdrop-blur-sm border-l-4 border-white"
                                        : "text-white/90 hover:bg-purple-600/60 backdrop-blur-sm"
                                } 
                  rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4`
                            }
                        >
                            <BiGroup className="text-xl" />
                            <span>Group</span>
                        </NavLink>
                    </motion.li>

                    <div className="mt-4 border-t border-purple-400/30 pt-4">
                        <motion.li variants={itemVariants}>
                            <button
                                onClick={handleLogout}
                                className="text-white/90 hover:bg-purple-600/60 hover:text-white 
                rounded-lg flex items-center gap-3 transition-all duration-300 py-3 pl-4 w-full"
                            >
                                <MdLogout className="text-xl" />
                                <span>Logout</span>
                            </button>
                        </motion.li>
                    </div>

                    {/* User Profile Section at Bottom */}
                    <motion.div
                        className="mt-auto mb-4 bg-purple-800/40 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-purple-400/20"
                        variants={itemVariants}
                    >
                        {users?.photoURL ? (
                            <img
                                src={users.photoURL}
                                alt="User Profile"
                                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                onError={(e) => {
                                    // If image fails to load, replace with fallback
                                    e.target.onerror = null; // Prevent infinite fallback loop
                                    e.target.src =
                                        "https://ui-avatars.com/api/?name=" +
                                        (users?.displayName
                                            ? encodeURIComponent(
                                                  users.displayName
                                              )
                                            : "User") +
                                        "&background=8B5CF6&color=fff";
                                }}
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl border-2 border-white">
                                {users?.displayName
                                    ? users.displayName.charAt(0).toUpperCase()
                                    : "U"}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-white text-sm">
                                {users?.displayName || "User"}
                            </p>
                            <p className="text-xs text-white/80">Student</p>
                        </div>
                        <div className="relative ml-auto">
                            <IoNotifications className="text-2xl text-white cursor-pointer hover:text-yellow-200 transition-colors" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                3
                            </span>
                        </div>
                    </motion.div>
                </motion.ul>
            </div>
        </div>
    );
};

export default StudentDashboard;
