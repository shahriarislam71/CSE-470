import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiCalendar, HiChevronRight, HiClock } from "react-icons/hi";

const EnrolledCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Calculate days remaining until end date
    const calculateDaysRemaining = (endTimeStr) => {
        const endTime = new Date(endTimeStr);
        const today = new Date();
        const diffTime = endTime - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Calculate course progress
    const calculateProgress = (endTimeStr) => {
        const daysRemaining = calculateDaysRemaining(endTimeStr);
        // Assuming course lasts 120 days
        const courseDuration = 120;
        const daysPassed = courseDuration - daysRemaining;
        const progress = Math.min(
            Math.round((daysPassed / courseDuration) * 100),
            100
        );
        return progress;
    };

    useEffect(() => {
        setCourses([
            {
                coursePicture:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgWVgzEpNo6FVTWvlowZngttxRheolOynDQ&s",
                courseName: "Introduction to Programming",
                courseTitle: "CSE110",
                endTime: "2025-06-15T23:59:59Z",
                weeks: [
                    {
                        week: 1,
                        materials: [
                            {
                                type: "video",
                                title: "Introduction to Programming",
                                url: "https://example.com/intro.mp4",
                            },
                            {
                                type: "lecture_notes",
                                title: "Programming Basics",
                                url: "https://example.com/notes.pdf",
                            },
                            {
                                type: "assignment",
                                title: "Basic Syntax",
                                questions: 10,
                                dueDate: "2024-12-03T23:59:00Z",
                                url: "https://example.com/assignment1.pdf",
                            },
                            {
                                type: "practice_problem",
                                title: "Loops & Conditions",
                                problems: 5,
                                url: "https://example.com/practice1.pdf",
                            },
                        ],
                    },
                    {
                        week: 2,
                        materials: [
                            {
                                type: "video",
                                title: "Functions & Arrays",
                                url: "https://example.com/functions.mp4",
                            },
                            {
                                type: "lecture_notes",
                                title: "Understanding Functions",
                                url: "https://example.com/functions_notes.pdf",
                            },
                            {
                                type: "assignment",
                                title: "Array Operations",
                                questions: 8,
                                dueDate: "2024-12-10T23:59:00Z",
                                url: "https://example.com/assignment2.pdf",
                            },
                            {
                                type: "practice_problem",
                                title: "Function Challenges",
                                problems: 7,
                                url: "https://example.com/practice2.pdf",
                            },
                        ],
                    },
                ],
                announcements: [
                    {
                        name: "John Doe",
                        photo: "https://example.com/john_doe.jpg",
                        date: "2025-02-10",
                        message: "Welcome to Introduction to Programming!",
                    },
                ],
                chatrooms: "https://example.com/chatroom_CSE110",
            },
            {
                coursePicture:
                    "https://www.shutterstock.com/image-photo/ai-artificial-intelligence-search-engine-600nw-2304697097.jpg",
                courseName: "Data Science Essentials",
                courseTitle: "CSE430",
                endTime: "2025-07-10T23:59:59Z",
                weeks: [
                    {
                        week: 1,
                        materials: [
                            {
                                type: "video",
                                title: "Introduction to Data Science",
                                url: "https://example.com/data_science_intro.mp4",
                            },
                            {
                                type: "lecture_notes",
                                title: "Data Science Overview",
                                url: "https://example.com/data_notes.pdf",
                            },
                            {
                                type: "assignment",
                                title: "Exploratory Data Analysis",
                                questions: 12,
                                dueDate: "2024-12-05T23:59:00Z",
                                url: "https://example.com/assignment3.pdf",
                            },
                            {
                                type: "practice_problem",
                                title: "Data Cleaning Challenges",
                                problems: 6,
                                url: "https://example.com/practice3.pdf",
                            },
                        ],
                    },
                ],
                announcements: [
                    {
                        name: "Jane Smith",
                        photo: "https://example.com/jane_smith.jpg",
                        date: "2025-02-11",
                        message: "New assignments have been uploaded!",
                    },
                ],
                chatrooms: "https://example.com/chatroom_CSE430",
            },
            {
                coursePicture:
                    "https://t3.ftcdn.net/jpg/02/14/53/92/360_F_214539232_YnUrtuwUEt84gHuU0qG8l7OwZvH4rnPG.jpg",
                courseName: "Web Development Bootcamp",
                courseTitle: "CSE370",
                endTime: "2025-08-05T23:59:59Z",
                weeks: [
                    {
                        week: 1,
                        materials: [
                            {
                                type: "video",
                                title: "HTML & CSS Basics",
                                url: "https://example.com/html_css.mp4",
                            },
                            {
                                type: "lecture_notes",
                                title: "Introduction to Web Development",
                                url: "https://example.com/web_notes.pdf",
                            },
                            {
                                type: "assignment",
                                title: "Build a Simple Webpage",
                                questions: 5,
                                dueDate: "2024-12-10T23:59:00Z",
                                url: "https://example.com/assignment5.pdf",
                            },
                            {
                                type: "practice_problem",
                                title: "CSS Layout Challenges",
                                problems: 4,
                                url: "https://example.com/practice5.pdf",
                            },
                        ],
                    },
                ],
                announcements: [
                    {
                        name: "Alice Brown",
                        photo: "https://example.com/alice_brown.jpg",
                        date: "2025-02-12",
                        message: "Course materials have been updated!",
                    },
                ],
                chatrooms: "https://example.com/chatroom_CSE370",
            },
            {
                coursePicture:
                    "https://media.istockphoto.com/id/966248982/photo/robot-with-education-hud.jpg?s=612x612&w=0&k=20&c=9eoZYRXNZsuU3edU87PksxN4Us-c9rB6IR7U_IGZ-U8=",
                courseName: "Machine Learning with Python",
                courseTitle: "CSE422",
                endTime: "2025-09-20T23:59:59Z",
                weeks: [
                    {
                        week: 1,
                        materials: [
                            {
                                type: "video",
                                title: "Introduction to ML",
                                url: "https://example.com/ml_intro.mp4",
                            },
                            {
                                type: "lecture_notes",
                                title: "What is Machine Learning?",
                                url: "https://example.com/ml_notes.pdf",
                            },
                            {
                                type: "assignment",
                                title: "Supervised Learning Basics",
                                questions: 10,
                                dueDate: "2024-12-12T23:59:00Z",
                                url: "https://example.com/assignment6.pdf",
                            },
                            {
                                type: "practice_problem",
                                title: "Regression Challenges",
                                problems: 6,
                                url: "https://example.com/practice6.pdf",
                            },
                        ],
                    },
                ],
                announcements: [
                    {
                        name: "David Clark",
                        photo: "https://example.com/david_clark.jpg",
                        date: "2025-02-13",
                        message: "Discussion session will be held tomorrow.",
                    },
                ],
                chatrooms: "https://example.com/chatroom_CSE422",
            },
            {
                coursePicture:
                    "https://www.theforage.com/blog/wp-content/uploads/2022/12/what-is-cybersecurity.jpg",
                courseName: "Cybersecurity Fundamentals",
                courseTitle: "CSE410",
                endTime: "2025-10-12T23:59:59Z",
                weeks: [
                    {
                        week: 1,
                        materials: [
                            {
                                type: "video",
                                title: "Cyber Threats Overview",
                                url: "https://example.com/cyber_threats.mp4",
                            },
                            {
                                type: "lecture_notes",
                                title: "Introduction to Cybersecurity",
                                url: "https://example.com/cybersecurity_notes.pdf",
                            },
                            {
                                type: "assignment",
                                title: "Security Protocols",
                                questions: 15,
                                dueDate: "2024-12-15T23:59:00Z",
                                url: "https://example.com/assignment7.pdf",
                            },
                            {
                                type: "practice_problem",
                                title: "Network Security Problems",
                                problems: 8,
                                url: "https://example.com/practice7.pdf",
                            },
                        ],
                    },
                ],
                announcements: [
                    {
                        name: "Emma Johnson",
                        photo: "https://example.com/emma_johnson.jpg",
                        date: "2025-02-14",
                        message: "Reminder: Project deadline approaching!",
                    },
                ],
                chatrooms: "https://example.com/chatroom_CSE410",
            },
        ]);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <div className="mt-10 mx-5">
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                </div>
            ) : courses.length > 0 ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-color text-3xl font-bold">
                                Enrolled Courses
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Continue your learning journey
                            </p>
                        </div>
                        <motion.button
                            onClick={() => setShowAll(!showAll)}
                            className="px-4 py-2 bg-[#8B5CF6] text-white font-medium rounded-lg hover:bg-[#A855F7] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-300/20"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {showAll ? "Show Less" : "See All"}
                            <HiChevronRight
                                className={`transition-transform duration-300 ${
                                    showAll ? "rotate-90" : ""
                                }`}
                            />
                        </motion.button>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {(showAll ? courses : courses.slice(0, 3)).map(
                            (course, index) => {
                                const progress = calculateProgress(
                                    course.endTime
                                );
                                const daysRemaining = calculateDaysRemaining(
                                    course.endTime
                                );

                                return (
                                    <motion.div
                                        key={index}
                                        className="relative overflow-hidden rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300"
                                        variants={cardVariants}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="relative">
                                            <img
                                                src={course.coursePicture}
                                                alt={course.courseName}
                                                className="w-full h-48 object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#012d5b]/80 to-transparent"></div>

                                            {/* Course code pill */}
                                            <div className="absolute top-4 right-4 bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                                {course.courseTitle}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h2 className="text-xl font-bold text-[#012d5b] mb-2">
                                                {course.courseName}
                                            </h2>

                                            {/* Progress bar */}
                                            <div className="mt-3 mb-4">
                                                <div className="flex justify-between items-center mb-1 text-sm">
                                                    <span className="text-gray-600">
                                                        Progress
                                                    </span>
                                                    <span className="font-medium text-purple-700">
                                                        {progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Course meta info */}
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <HiCalendar className="text-purple-500" />
                                                    <span>
                                                        {new Date(
                                                            course.endTime
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <HiClock className="text-purple-500" />
                                                    <span>
                                                        {daysRemaining} days
                                                        left
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Materials summary */}
                                            <div className="flex gap-2 flex-wrap mb-4">
                                                {course.weeks[0].materials
                                                    .slice(0, 2)
                                                    .map((material, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs"
                                                        >
                                                            {material.type.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>
                                                    ))}
                                                {course.weeks[0].materials
                                                    .length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                                        +
                                                        {course.weeks[0]
                                                            .materials.length -
                                                            2}{" "}
                                                        more
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                to={`/enrolledCourses/${course.courseTitle}`}
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="w-full py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white rounded-lg font-medium shadow-md shadow-purple-300/30 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-300 flex justify-center items-center gap-2"
                                                >
                                                    Continue Learning
                                                    <HiChevronRight className="text-lg" />
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            }
                        )}
                    </motion.div>

                    {/* Show more button for mobile */}
                    {courses.length > 3 && !showAll && (
                        <div className="mt-6 text-center md:hidden">
                            <motion.button
                                onClick={() => setShowAll(true)}
                                className="px-4 py-2 text-purple-700 font-medium rounded-lg border border-purple-300 hover:bg-purple-50 transition-all duration-300"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Show More Courses
                            </motion.button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                        <HiCalendar className="text-5xl text-purple-700" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        No Enrolled Courses
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Explore available courses and start your learning
                        journey today!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Browse Courses
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;
