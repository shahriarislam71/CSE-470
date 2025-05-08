import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaSave,
    FaUndo,
    FaFile,
    FaBook,
    FaVideo,
    FaTools,
    FaArrowLeft,
} from "react-icons/fa";
import {
    HiCode,
    HiDocumentText,
    HiAcademicCap,
    HiDatabase,
    HiInformationCircle,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { Authcontext } from "../../../context/AuthProvider";

const ResourceContribute = () => {
    const navigate = useNavigate();
    const { users } = useContext(Authcontext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "book",
        description: "",
        link: "",
        imageUrl: "",
        author: "",
        creator: "",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        readTime: "",
        contributorName: users?.displayName || users?.name || "Anonymous",
        contributorRole: users?.role || "student",
        contributorEmail: users?.email || "",
    });

    const resourceTypes = [
        {
            type: "book",
            label: "Book",
            icon: <FaBook className="text-blue-600" />,
        },
        {
            type: "video",
            label: "Video",
            icon: <FaVideo className="text-red-600" />,
        },
        {
            type: "tool",
            label: "Tool",
            icon: <FaTools className="text-green-600" />,
        },
        {
            type: "article",
            label: "Article",
            icon: <HiDocumentText className="text-yellow-600" />,
        },
        {
            type: "documentation",
            label: "Documentation",
            icon: <HiCode className="text-purple-600" />,
        },
        {
            type: "course",
            label: "Course",
            icon: <HiAcademicCap className="text-indigo-600" />,
        },
        {
            type: "dataset",
            label: "Dataset",
            icon: <HiDatabase className="text-pink-600" />,
        },
        {
            type: "cheatsheet",
            label: "Cheatsheet",
            icon: <FaFile className="text-orange-600" />,
        },
        {
            type: "practice",
            label: "Practice Project",
            icon: <FaFile className="text-cyan-600" />,
        },
        {
            type: "community",
            label: "Community",
            icon: <HiInformationCircle className="text-teal-600" />,
        },
    ];

    // Load enrolled courses
    useEffect(() => {
        fetch("/enrolledcourse.json")
            .then((response) => response.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
    };

    const handleCancel = () => {
        if (selectedCourse) {
            setSelectedCourse(null);
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title || !formData.description || !formData.link) {
            Swal.fire({
                title: "Error",
                text: "Please fill in all required fields",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        // In a real application, you would send this to your backend
        // For now, we'll simulate success
        Swal.fire({
            title: "Resource Contributed!",
            text: `Your resource has been added to ${selectedCourse.courseName} successfully.`,
            icon: "success",
            confirmButtonColor: "#3085d6",
        }).then(() => {
            // Reset form or go back to course selection
            setSelectedCourse(null);
            setFormData({
                title: "",
                type: "book",
                description: "",
                link: "",
                imageUrl: "",
                author: "",
                creator: "",
                date: new Date().toISOString().split("T")[0],
                duration: "",
                readTime: "",
                contributorName:
                    users?.displayName || users?.name || "Anonymous",
                contributorRole: users?.role || "student",
                contributorEmail: users?.email || "",
            });
        });
    };

    const handleViewResources = (courseTitle) => {
        navigate(`/enrolledCourses/${courseTitle}/other-resources`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleCancel}
                        className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <h1 className="text-3xl font-bold text-color">
                        {selectedCourse
                            ? `Contribute to ${selectedCourse.courseName}`
                            : "Contribute Resources"}
                    </h1>
                </div>

                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">
                        About This Feature
                    </h2>
                    <p className="text-blue-700">
                        This feature allows students, instructors, and
                        department coordination officers (DCOs) to contribute
                        supplemental learning resources that may help others in
                        their courses. Share books, videos, tools, or any other
                        resource that you&quot;ve found helpful!
                    </p>
                </div>

                {!selectedCourse ? (
                    // Course Selection View
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Select a course to contribute to:
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map((course) => (
                                <div
                                    key={course.courseTitle}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                                >
                                    <h3 className="text-lg font-medium mb-2">
                                        {course.courseTitle}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        {course.courseName}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Instructor: {course.instructor}
                                    </p>

                                    <div className="mt-auto flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleCourseSelect(course)
                                            }
                                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-1"
                                        >
                                            <FaPlus size={12} /> Contribute
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleViewResources(
                                                    course.courseTitle
                                                )
                                            }
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            View Resources
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Resource Form View
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Add New Resource
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title*
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resource Type*
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        {resourceTypes.map((type) => (
                                            <option
                                                key={type.type}
                                                value={type.type}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link URL*
                                    </label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Creator
                                    </label>
                                    <input
                                        type="text"
                                        name="creator"
                                        value={formData.creator}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date*
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2h 30m, 5 days"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Read Time
                                    </label>
                                    <input
                                        type="text"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 15 min"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description*
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                                >
                                    <FaUndo /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                                >
                                    <FaSave /> Contribute Resource
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceContribute;
