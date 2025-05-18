import { useState, useEffect } from 'react';
import { FiSearch, FiBook, FiUser, FiMail, FiCalendar, FiRefreshCw, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentEmail, setStudentEmail] = useState('');

    // API endpoints
    const API_URL = 'http://localhost:5000/courses';
    const SECTION_STUDENTS_URL = 'http://localhost:5000/section-students';
    const ENROLLED_COURSES_URL = 'http://localhost:5000/enrolled-courses';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const refreshCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            setCourses(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        setShowEnrollModal(true);
    };

    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        
        if (!studentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address',
            });
            return;
        }

        try {
            // Check if student is eligible to enroll
            const response = await fetch(`${SECTION_STUDENTS_URL}?email=${studentEmail}&courseCode=${selectedCourse.courseCode}`);
            const sectionStudents = await response.json();

            if (sectionStudents.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Enrollment Failed',
                    text: 'You are not registered for this course section. Please contact your teacher.',
                });
                return;
            }

            // Check if already enrolled
            const enrolledResponse = await fetch(`${ENROLLED_COURSES_URL}?email=${studentEmail}&courseCode=${selectedCourse.courseCode}`);
            const enrolledCourses = await enrolledResponse.json();

            if (enrolledCourses.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Already Enrolled',
                    text: 'You are already enrolled in this course',
                });
                return;
            }

            // Enroll the student
            const enrollResponse = await fetch(ENROLLED_COURSES_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentEmail: studentEmail,
                    courseId: selectedCourse._id,
                    courseCode: selectedCourse.courseCode,
                    courseName: selectedCourse.courseName,
                    facultyInitial: selectedCourse.facultyInitial,
                    enrolledAt: new Date().toISOString(),
                    status: 'active'
                }),
            });

            if (enrollResponse.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Enrollment Successful!',
                    text: `You have successfully enrolled in ${selectedCourse.courseName}`,
                });
                setShowEnrollModal(false);
                setStudentEmail('');
            } else {
                throw new Error('Failed to enroll');
            }
        } catch (err) {
            console.error('Enrollment error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Enrollment Failed',
                text: 'An error occurred while processing your enrollment. Please try again.',
            });
        }
    };

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center p-6 max-w-md bg-red-50 rounded-lg border border-red-200">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Courses</h2>
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={refreshCourses}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Enroll Modal */}
            {showEnrollModal && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Enroll in {selectedCourse.courseName}
                        </h3>
                        <form onSubmit={handleEnrollSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="student@university.edu"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEnrollModal(false);
                                        setStudentEmail('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Enroll Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        University Course Catalog
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Browse and enroll in available courses
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-md mx-auto">
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
                            placeholder="Search by course code or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            <button
                                onClick={refreshCourses}
                                className="px-4 h-full bg-indigo-100 text-indigo-700 rounded-r-md hover:bg-indigo-200 transition"
                            >
                                <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                {/* Course Grid */}
                {!loading && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map(course => (
                                <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
                                    <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
                                        <img 
                                            src={course.imageUrl} 
                                            alt={course.courseName}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <h3 className="text-xl font-bold text-white">{course.courseName}</h3>
                                            <p className="text-indigo-200">{course.courseCode}</p>
                                        </div>
                                        <span className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${
                                            course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                                        
                                        <div className="space-y-3 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FiUser className="mr-2 text-indigo-500" />
                                                <span>Faculty: {course.facultyInitial}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiMail className="mr-2 text-indigo-500" />
                                                <span>{course.email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiCalendar className="mr-2 text-indigo-500" />
                                                <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleEnrollClick(course)}
                                            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <FiPlus className="mr-2" />
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? 'Try a different search term' : 'No courses available at the moment'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Course;