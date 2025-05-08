import { useContext, useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { HiChartPie, HiClock, HiCalendar, HiAcademicCap } from "react-icons/hi";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Authcontext } from "../../context/AuthProvider";
import Banner from "./Banner";
import EnrolledCourses from "./EnrolledCourses";

const StatCard = ({ icon: Icon, title, value, bgColor, textColor }) => (
    <motion.div
        className={`${bgColor} rounded-xl p-5 shadow-lg flex items-center gap-4`}
        whileHover={{
            y: -5,
            boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.2 }}
    >
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
            <Icon className={`text-2xl ${textColor}`} />
        </div>
        <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <h3 className="text-xl font-bold text-white">{value}</h3>
        </div>
    </motion.div>
);

StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
};

const Home = () => {
    const [imageError, setImageError] = useState(false);
    const { users, loading } = useContext(Authcontext);

    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent infinite fallback loop
        e.target.src =
            "https://ui-avatars.com/api/?name=" +
            (users?.displayName
                ? encodeURIComponent(users.displayName)
                : "User") +
            "&background=8B5CF6&color=fff";
        setImageError(false); // Reset error state to show the fallback image
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    const statsData = [
        {
            icon: HiAcademicCap,
            title: "Enrolled Courses",
            value: "5",
            bgColor: "bg-purple-600",
            textColor: "text-purple-100",
        },
        {
            icon: HiChartPie,
            title: "Avg. Progress",
            value: "63%",
            bgColor: "bg-blue-600",
            textColor: "text-blue-100",
        },
        {
            icon: HiClock,
            title: "Study Hours",
            value: "28h",
            bgColor: "bg-emerald-600",
            textColor: "text-emerald-100",
        },
        {
            icon: HiCalendar,
            title: "Upcoming Tasks",
            value: "8",
            bgColor: "bg-amber-600",
            textColor: "text-amber-100",
        },
    ];

    return (
        <div className="px-4 md:px-6">
            {/* Header with Welcome & User Info */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                    {users?.photoURL && !imageError ? (
                        <img
                            src={users.photoURL}
                            alt="Profile"
                            className="w-16 h-16 border-2 border-purple-500 rounded-full object-cover shadow-md"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {users?.displayName ? (
                                users.displayName.charAt(0).toUpperCase()
                            ) : (
                                <IoPersonCircleSharp className="text-4xl" />
                            )}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome back,{" "}
                            <span className="text-color">
                                {users?.displayName || "Student"}
                            </span>
                            !
                        </h1>
                        <p className="text-gray-600">
                            Continue your learning journey today
                        </p>
                    </div>
                </div>

                {/* Notification Button */}
                <button className="relative p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors duration-300">
                    <FaBell className="text-xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                        3
                    </span>
                </button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
                {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        title={stat.title}
                        value={stat.value}
                        bgColor={stat.bgColor}
                        textColor={stat.textColor}
                    />
                ))}
            </motion.div>

            {/* Banner Section */}
            <Banner />

            {/* Enrolled Courses */}
            <EnrolledCourses />
        </div>
    );
};

export default Home;
