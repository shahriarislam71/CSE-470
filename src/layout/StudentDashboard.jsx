import { useContext } from "react";
import { AiFillHome } from "react-icons/ai";
import { BiSolidGraduation } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { MdSchool } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";
import { Authcontext } from "../context/AuthProvider";

const StudentDashboard = () => {
  const {users,loading} = useContext(Authcontext)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <Outlet />
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden fixed top-4 left-4 z-50"
        >
          Open Menu
        </label>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="background rounded-lg menu sidebar text-base-content min-h-full w-80 p-2">
          {/* Education Icon at the Top Center */}
          <div className="flex justify-center py-4">
            <MdSchool className="text-5xl text-white" />
          </div>

          {/* Sidebar Content */}
          <li>
            <NavLink
              to="/home"
              end // This ensures exact match for /home
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-xl text-white bg-purple-700 rounded-lg flex items-center gap-2"
                  : "flex items-center gap-2 text-lg hover:bg-purple-600 hover:rounded-lg hover:text-white"
              }
            >
              <AiFillHome /> Student Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/course"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-xl text-white bg-purple-700 rounded-lg flex items-center gap-2"
                  : "flex items-center gap-2 text-lg hover:bg-purple-600 hover:rounded-lg hover:text-white"
              }
            >
              <BiSolidGraduation /> Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/chatrooms"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-xl text-white bg-purple-700 rounded-lg flex items-center gap-2"
                  : "flex items-center gap-2 text-lg hover:bg-purple-600 hover:rounded-lg hover:text-white"
              }
            >
              <BiSolidGraduation /> Chatrooms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/connect"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-xl text-white bg-purple-700 rounded-lg flex items-center gap-2"
                  : "flex items-center gap-2 text-lg hover:bg-purple-600 hover:rounded-lg hover:text-white"
              }
            >
              <BiSolidGraduation /> Connect
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/inbox"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-xl text-white bg-purple-700 rounded-lg flex items-center gap-2"
                  : "flex items-center gap-2 text-lg hover:bg-purple-600 hover:rounded-lg hover:text-white"
              }
            >
              <BiSolidGraduation /> Inbox
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/group"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-xl text-white bg-purple-700 rounded-lg flex items-center gap-2"
                  : "flex items-center gap-2 text-lg hover:bg-purple-600 hover:rounded-lg hover:text-white"
              }
            >
              <BiSolidGraduation /> Group
            </NavLink>
          </li>
          {/* Other NavLinks remain the same with updated className pattern */}

          {/* User Profile Section at Bottom */}
          <div className="absolute bottom-4 flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              <img
                src={users?.photoURL}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="text-sm">
                <p className="font-semibold text-white">{users?.displayName}</p>
                <p className="text-white">Student</p>
              </div>
            </div>
            <div className="relative ml-auto mr-4">
              <IoNotifications className="text-2xl text-gray-400 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
