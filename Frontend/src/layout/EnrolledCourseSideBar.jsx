import { useEffect, useState } from 'react';
import { BsFileEarmarkText } from 'react-icons/bs';
import { FaArchive, FaArrowLeft, FaBook, FaRegFileAlt, FaRegFileVideo, FaUserGraduate } from 'react-icons/fa';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { MdAnnouncement, MdOutlineAssignment, MdOutlineUnsubscribe } from 'react-icons/md';
import { Link, NavLink, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import Chatroom from '../component/dashboard/EnrolledCourses/ChatRoom'; // Import the Chatroom component

const EnrolledCourseSideBar = () => {
    const { courseTitle } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [sectionName, setSectionName] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [userType, setUserType] = useState('student'); // or 'teacher'
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Get section name from location state
        if (location.state?.sectionName) {
            setSectionName(location.state.sectionName);
        }

        // Get user data (you might get this from context or auth)
        setUserEmail(localStorage.getItem('userEmail') || 'student@example.com');
        setUserType(localStorage.getItem('userType') || 'student');

        // Fetch course data
        fetch('../../public/enrolledcourse.json')
            .then((response) => response.json())
            .then((data) => {
                const selectedCourse = data.find(c => c.courseTitle === courseTitle);
                setCourse(selectedCourse);
            })
            .catch(error => console.error("Error fetching course data:", error));

        // Check if we're on the chatroom route
        setShowChat(location.pathname.includes('chatroom'));
    }, [courseTitle, location]);

    // Function to create navigation links with section data
    const createNavLink = (to, icon, text) => (
        <li>
            <NavLink 
                to={to}
                state={{ sectionName }}
                className={({ isActive }) => 
                    isActive 
                    ? "font-semibold text-xl text-white flex items-center gap-2" 
                    : "flex items-center gap-2 text-lg"
                }
                onClick={() => setShowChat(to.includes('chatroom'))}
            >
                {icon} {text}
            </NavLink>
        </li>
    );

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-80 bg-[#012d5b] text-white flex-shrink-0 hidden lg:block">
                <div className="p-4 h-full flex flex-col">
                    <Link 
                        title='Back to Dashboard' 
                        to={'/home'}
                        state={{ sectionName }}
                        className="mb-6"
                    >
                        <FaArrowLeft className='w-10 h-10 p-2 border-2 rounded-full hover:bg-blue-700 transition'></FaArrowLeft>
                    </Link>
                    
                    {/* Course Info */}
                    <div className="mb-6 p-3 bg-blue-700 rounded-lg">
                        <h3 className="font-bold text-lg">{courseTitle}</h3>
                        {sectionName && <p className="text-sm opacity-80">Section: {sectionName}</p>}
                    </div>

                    {/* Navigation Sections */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Course Materials */}
                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 px-2">Course Materials</h4>
                            <ul className="space-y-1">
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/course-outline`,
                                    <FaRegFileAlt />,
                                    "Course Outline"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/assignments`,
                                    <MdOutlineAssignment />,
                                    "Assignments"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/videos`,
                                    <FaRegFileVideo />,
                                    "Videos"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/practiceproblem`,
                                    <BsFileEarmarkText />,
                                    "Practice Sheets"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/studentresources`,
                                    <FaUserGraduate />,
                                    "Student Resources"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/lecturenotes`,
                                    <FaBook />,
                                    "Lecture Notes"
                                )}
                            </ul>
                        </div>

                        {/* Communications */}
                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 px-2">Communications</h4>
                            <ul className="space-y-1">
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/announcement`,
                                    <MdAnnouncement />,
                                    "Announcements"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/chatroom`,
                                    <IoChatbubblesOutline />,
                                    "Chat Room"
                                )}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div>
                            <h4 className="font-bold text-lg mb-2 px-2">Actions</h4>
                            <ul className="space-y-1">
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/archive`,
                                    <FaArchive />,
                                    "Archive"
                                )}
                                {createNavLink(
                                    `/enrolledCourses/${courseTitle}/unenroll`,
                                    <MdOutlineUnsubscribe />,
                                    "Unenroll"
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <label htmlFor="mobile-drawer" className="btn btn-circle btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </label>
            </div>

            {/* Mobile Drawer */}
            <div className="drawer lg:hidden">
                <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side">
                    <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 h-full bg-[#012d5b] text-white">
                        <Link 
                            title='Back to Dashboard' 
                            to={'/home'}
                            state={{ sectionName }}
                            className="mb-6"
                        >
                            <FaArrowLeft className='w-10 h-10 p-2 border-2 rounded-full hover:bg-blue-700 transition'></FaArrowLeft>
                        </Link>
                        
                        {/* Course Info */}
                        <div className="mb-6 p-3 bg-blue-700 rounded-lg">
                            <h3 className="font-bold text-lg">{courseTitle}</h3>
                            {sectionName && <p className="text-sm opacity-80">Section: {sectionName}</p>}
                        </div>

                        {/* Navigation Sections */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Course Materials */}
                            <div className="mb-6">
                                <h4 className="font-bold text-lg mb-2 px-2">Course Materials</h4>
                                <ul className="space-y-1">
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/course-outline`,
                                        <FaRegFileAlt />,
                                        "Course Outline"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/assignments`,
                                        <MdOutlineAssignment />,
                                        "Assignments"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/videos`,
                                        <FaRegFileVideo />,
                                        "Videos"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/practiceproblem`,
                                        <BsFileEarmarkText />,
                                        "Practice Sheets"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/studentresources`,
                                        <FaUserGraduate />,
                                        "Student Resources"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/lecturenotes`,
                                        <FaBook />,
                                        "Lecture Notes"
                                    )}
                                </ul>
                            </div>

                            {/* Communications */}
                            <div className="mb-6">
                                <h4 className="font-bold text-lg mb-2 px-2">Communications</h4>
                                <ul className="space-y-1">
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/announcement`,
                                        <MdAnnouncement />,
                                        "Announcements"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/chatroom`,
                                        <IoChatbubblesOutline />,
                                        "Chat Room"
                                    )}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div>
                                <h4 className="font-bold text-lg mb-2 px-2">Actions</h4>
                                <ul className="space-y-1">
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/archive`,
                                        <FaArchive />,
                                        "Archive"
                                    )}
                                    {createNavLink(
                                        `/enrolledCourses/${courseTitle}/unenroll`,
                                        <MdOutlineUnsubscribe />,
                                        "Unenroll"
                                    )}
                                </ul>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {showChat ? (
                    <div className="h-full flex flex-col">
                        {/* Chatroom Header */}
                        <div className="bg-white shadow-sm p-4 border-b">
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => setShowChat(false)}
                                    className="lg:hidden flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Back
                                </button>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {courseTitle} - Section {sectionName} Chat
                                </h2>
                                <div className="w-8"></div> {/* Spacer for alignment */}
                            </div>
                        </div>

                        {/* Chatroom Component */}
                        <div className="flex-1 p-4">
                            <Chatroom 
                                courseCode={courseTitle} 
                                section={sectionName} 
                                userEmail={userEmail} 
                                userType={userType} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        <Outlet context={{ course, sectionName }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourseSideBar;