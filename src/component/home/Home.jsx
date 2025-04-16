
import { FaBell } from "react-icons/fa";
import { IoPersonCircleSharp } from 'react-icons/io5';
import Banner from "./Banner";
import EnrolledCourses from "./EnrolledCourses";

const Home = () => {
    return (
        <div className="">
            {/* Top Navigation Bar */}
            <div className="top-6 ms-5 w-[1140px]  flex justify-between items-center text-white z-50">
                {/* User Section */}
                <div className="flex items-center gap-3">
                    <IoPersonCircleSharp className="text-3xl border-solid border-2 border-indigo-500 rounded-full text-color w-10" />
                    <div className="">
                        <p className="text-xl font-semibold text-color">John Doe</p> {/* Replace with dynamic user name */}
                        <p className="text-[#012d5b]">Senior Software Developer</p>
                    </div>
                </div>

                {/* Notification Button */}
                <button className="relative p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                    <FaBell className="text-2xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                </button>
            </div>

            <Banner></Banner>
            <EnrolledCourses></EnrolledCourses>
        </div>
    );
};

export default Home;