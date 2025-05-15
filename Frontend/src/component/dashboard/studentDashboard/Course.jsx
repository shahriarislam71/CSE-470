import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
       setCourses([
        {
            "id": 1,
            "courseImage": "https://miro.medium.com/v2/resize:fit:1200/1*V-Jp13LvtVc2IiY2fp4qYw.jpeg",
            "courseTitle": "Introduction to Web Development",
            "courseName": "Web Development 101",
            "instructorName": "John Doe",
            "instructorInitial": "JD",
            "courseOutline": [
                "HTML Basics",
                "CSS Styling",
                "JavaScript Essentials",
                "Responsive Design",
                "Introduction to React"
            ],
            "courseOutcome": [
                "Build static web pages using HTML & CSS",
                "Create interactive elements with JavaScript",
                "Understand responsive web design",
                "Develop a basic React application"
            ]
        },
        {
            "id": 2,
            "courseImage": "https://static.vecteezy.com/system/resources/thumbnails/005/442/693/small/data-science-analytics-internet-and-technology-concept-concept-photo.jpg",
            "courseTitle": "Data Science with Python",
            "courseName": "Python for Data Science",
            "instructorName": "Sarah Lee",
            "instructorInitial": "SL",
            "courseOutline": [
                "Python Basics",
                "Data Analysis with Pandas",
                "Data Visualization",
                "Machine Learning Basics",
                "Deep Learning Introduction"
            ],
            "courseOutcome": [
                "Analyze and manipulate data using Python",
                "Visualize data effectively",
                "Understand the basics of machine learning",
                "Train simple deep learning models"
            ]
        },
        {
            "id": 3,
            "courseImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGeUfCkVjBg7x2X8_2ADhEcVnVgJN3klF8Lg&s",
            "courseTitle": "Digital Marketing Essentials",
            "courseName": "Marketing 101",
            "instructorName": "Michael Smith",
            "instructorInitial": "MS",
            "courseOutline": [
                "SEO Basics",
                "Social Media Marketing",
                "Google Ads",
                "Email Marketing",
                "Analytics and Reporting"
            ],
            "courseOutcome": [
                "Optimize websites for search engines",
                "Run effective social media campaigns",
                "Understand PPC advertising",
                "Analyze marketing data and performance"
            ]
        },
        {
            "id": 4,
            "courseImage": "https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto",
            "courseTitle": "JavaScript Advanced Concepts",
            "courseName": "Mastering JavaScript",
            "instructorName": "Emily Davis",
            "instructorInitial": "ED",
            "courseOutline": [
                "ES6+ Features",
                "Asynchronous JavaScript",
                "JavaScript Design Patterns",
                "Web APIs and Fetch",
                "Node.js Basics"
            ],
            "courseOutcome": [
                "Write clean and modern JavaScript",
                "Understand async programming",
                "Utilize design patterns for scalable code",
                "Work with APIs efficiently"
            ]
        },
        {
            "id": 5,
            "courseImage": "https://img.freepik.com/free-vector/cartoon-graphic-design-landing-page_52683-70881.jpg",
            "courseTitle": "Graphic Design for Beginners",
            "courseName": "Graphic Design 101",
            "instructorName": "Anna Brown",
            "instructorInitial": "AB",
            "courseOutline": [
                "Introduction to Adobe Photoshop",
                "Logo Design Basics",
                "Typography & Color Theory",
                "UI/UX Fundamentals",
                "Creating Social Media Graphics"
            ],
            "courseOutcome": [
                "Create stunning digital designs",
                "Understand typography and color usage",
                "Develop user-friendly UI/UX concepts",
                "Design effective marketing materials"
            ]
        },
        {
            "id": 6,
            "courseImage": "https://media.istockphoto.com/id/1420039900/photo/cyber-security-ransomware-email-phishing-encrypted-technology-digital-information-protected.jpg?s=612x612&w=0&k=20&c=8wFwFVMOpW9gF2GTOx0vagIKDaw3YNFnBVbYCmoTUSY=",
            "courseTitle": "Cybersecurity Basics",
            "courseName": "Introduction to Cybersecurity",
            "instructorName": "James Wilson",
            "instructorInitial": "JW",
            "courseOutline": [
                "Cybersecurity Principles",
                "Threat Detection",
                "Network Security",
                "Data Encryption",
                "Ethical Hacking Basics"
            ],
            "courseOutcome": [
                "Understand core cybersecurity concepts",
                "Detect and prevent security threats",
                "Protect networks and sensitive data",
                "Learn ethical hacking techniques"
            ]
        },
        {
            "id": 7,
            "courseImage": "https://media.istockphoto.com/id/1452604857/photo/businessman-touching-the-brain-working-of-artificial-intelligence-automation-predictive.jpg?s=612x612&w=0&k=20&c=GkAOxzduJbUKpS2-LX_l6jSKtyhdKlnPMo2ito4xpR4=",
            "courseTitle": "Artificial Intelligence Fundamentals",
            "courseName": "AI for Beginners",
            "instructorName": "Sophia Martinez",
            "instructorInitial": "SM",
            "courseOutline": [
                "Introduction to AI",
                "Machine Learning Basics",
                "Neural Networks",
                "AI in Everyday Applications",
                "Future of AI"
            ],
            "courseOutcome": [
                "Understand AI fundamentals",
                "Explore machine learning techniques",
                "Apply AI concepts in real-world scenarios",
                "Learn about AI career opportunities"
            ]
        },
        {
            "id": 8,
            "courseImage": "https://img.freepik.com/free-vector/app-development-banner_33099-1720.jpg",
            "courseTitle": "Mobile App Development",
            "courseName": "Building Apps with React Native",
            "instructorName": "Daniel White",
            "instructorInitial": "DW",
            "courseOutline": [
                "React Native Basics",
                "Building UI Components",
                "State Management",
                "API Integration",
                "Deploying Apps"
            ],
            "courseOutcome": [
                "Develop cross-platform mobile apps",
                "Create responsive and dynamic UI",
                "Manage state in React Native apps",
                "Deploy apps to app stores"
            ]
        },
        {
            "id": 9,
            "courseImage": "https://fintechweekly.s3.amazonaws.com/article/191/shutterstock_1016393917.jpg",
            "courseTitle": "Blockchain & Cryptocurrency",
            "courseName": "Understanding Blockchain",
            "instructorName": "Robert King",
            "instructorInitial": "RK",
            "courseOutline": [
                "What is Blockchain?",
                "Cryptocurrency Basics",
                "Smart Contracts",
                "DeFi Applications",
                "Future of Blockchain"
            ],
            "courseOutcome": [
                "Understand blockchain technology",
                "Explore cryptocurrency ecosystems",
                "Learn how smart contracts work",
                "Discover blockchain use cases"
            ]
        },
        {
            "id": 10,
            "courseImage": "https://t4.ftcdn.net/jpg/05/07/66/23/360_F_507662376_BTKmPlIGBvKlRHWKRNeFt7bj7H2SynQm.jpg",
            "courseTitle": "Cloud Computing with AWS",
            "courseName": "AWS Cloud Practitioner",
            "instructorName": "Olivia Green",
            "instructorInitial": "OG",
            "courseOutline": [
                "AWS Services Overview",
                "Cloud Storage Solutions",
                "AWS Security Best Practices",
                "Deploying Applications on AWS",
                "Cost Management on AWS"
            ],
            "courseOutcome": [
                "Understand cloud computing principles",
                "Learn AWS core services",
                "Deploy secure cloud applications",
                "Optimize AWS costs"
            ]
        }
    ])
    }, []);

    const filteredCourses = courses.filter((course) =>
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle enrollment click
    const handleEnrollClick = () => {
        setShowEmailModal(true);
    };

    // Handle email submission
    const handleEmailSubmit = () => {
        fetch("../../../../../public/addstudents.json")
            .then((response) => response.json())
            .then((students) => {
                const verifiedStudent = students.find(student => student.email === email);
                if (verifiedStudent) {
                    Swal.fire({
                        title: "Enrolled!",
                        text: "Enrolled with the verified student.",
                        icon: "success"
                    });
                    setShowEmailModal(false);
                    setEmail("");
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Email not found in the system.",
                        icon: "error"
                    });
                }
            })
            .catch(error => console.error("Error fetching student data:", error));
    };

    return (
        <div className="max-w-6xl mx-auto pl-8">
            {/* Section Header & Search */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-color">All Courses</h1>
                <input
                    type="text"
                    placeholder="Search Course..."
                    className="border-2 bg-white border-[#A855F7] px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 placeholder-[#012d5b] text-[#012d5b]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="cursor-pointer bg-white p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <img
                                src={course.courseImage}
                                alt={course.courseTitle}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <h2 className="text-xl font-semibold mt-3 text-[#A855F7]">
                                {course.courseTitle}
                            </h2>
                            <p className="text-[#012d5b] mt-1">
                                Instructor: {course.instructorName}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnrollClick();
                                }}
                                className="mt-4 px-4 py-2 bg-[#8B5CF6] text-white rounded-md transition duration-300 hover:bg-[#A855F7]"
                            >
                                Enroll Now
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-red-600 text-xl">No courses found</p>
                )}
            </div>

            {/* Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white ml-[300px] max-w-4xl w-full rounded-lg shadow-lg overflow-hidden max-h-full overflow-y-auto">
                        {/* Parallax Banner */}
                        <div
                            className="relative h-80 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${selectedCourse.courseImage})`,
                                backgroundAttachment: "fixed",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
                                <h2 className="text-3xl font-bold">{selectedCourse.courseTitle}</h2>
                                <p className="text-lg">{selectedCourse.courseName}</p>
                                <p className="text-md mt-1">
                                    Instructor: {selectedCourse.instructorName} ({selectedCourse.instructorInitial})
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="bg-red-500 absolute top-0 right-0 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content (Scroll Enabled) */}
                        <div className="p-6">
                            {/* Course Outline */}
                            <h3 className="text-xl font-bold text-[#A855F7]">Course Outline</h3>
                            <ul className="list-disc list-inside mt-2 text-[#012d5b]">
                                {selectedCourse.courseOutline.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                            {/* Course Outcome */}
                            <h3 className="text-xl font-bold text-[#A855F7] mt-6">Course Outcome</h3>
                            <ul className="list-disc list-inside mt-2 text-[#012d5b]">
                                {selectedCourse.courseOutcome.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                            {/* Enroll button */}
                            <button
                                onClick={handleEnrollClick}
                                className="mt-4 px-4 py-2 bg-[#8B5CF6] text-white rounded-md transition duration-300 hover:bg-[#A855F7]"
                            >
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold text-[#A855F7] mb-4">Enter Your Email</h2>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border-2 border-[#A855F7] px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 placeholder-[#012d5b] text-[#012d5b]"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEmailSubmit}
                                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-md transition duration-300 hover:bg-[#A855F7]"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Course;
