import { useContext, useState } from 'react';
import { FaBell } from "react-icons/fa";
import { IoPersonCircleSharp } from 'react-icons/io5';
import { Authcontext } from "../../context/AuthProvider";
import Banner from "./Banner";
import EnrolledCourses from "./EnrolledCourses";

const Home = () =>{ 
    const [imageError, setImageError] = useState(false);
    const {users,loading} = useContext(Authcontext)
 

    const handleImageError = () => {
        setImageError(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="">
            {/* Top Navigation Bar */}
            <div className="top-6 ms-5 w-auto flex flex-row justify-between items-center text-white z-50">
                {/* User Section */}
                <div className="flex items-center gap-3">
                    {users?.photoURL && !imageError ? (
                        <img 
                            src={users.photoURL} 
                            alt="Profile" 
                            className="w-10 h-10 border-2 border-indigo-500 rounded-full object-cover"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    ) : (
                        <IoPersonCircleSharp className="text-3xl border-solid border-2 border-indigo-500 rounded-full text-color w-10" />
                    )}
                    <div className="">
                        <p className="text-xl font-semibold text-color">
                            {users?.displayName || 'Guest User'}
                        </p>
                        <p className="text-[#012d5b]">
                            {users?.metadata?.role || 'Student'}
                        </p>
                    </div>
                </div>

                {/* Notification Button */}
                <button className="relative p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                    <FaBell className="text-2xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                </button>
            </div>

            <Banner />
            <EnrolledCourses />
        </div>
    );
};

export default Home;