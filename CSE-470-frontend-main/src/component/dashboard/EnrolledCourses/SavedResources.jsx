import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaExternalLinkAlt,
    FaBook,
    FaVideo,
    FaTools,
    FaFile,
    FaSearch,
    FaTrash,
    FaBookmark,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";
import {
    HiCode,
    HiDocumentText,
    HiAcademicCap,
    HiDatabase,
    HiInformationCircle,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const SavedResources = () => {
    const navigate = useNavigate();
    const [savedResources, setSavedResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

    // Load saved resources from localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem("savedResources") || "[]"
            );
            setSavedResources(saved);
        } catch (error) {
            console.error("Error loading saved resources:", error);
            setSavedResources([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const resourceTypes = [
        {
            type: "book",
            label: "Books",
            icon: <FaBook className="text-blue-600" />,
        },
        {
            type: "video",
            label: "Videos",
            icon: <FaVideo className="text-red-600" />,
        },
        {
            type: "tool",
            label: "Tools",
            icon: <FaTools className="text-green-600" />,
        },
        {
            type: "article",
            label: "Articles",
            icon: <HiDocumentText className="text-yellow-600" />,
        },
        {
            type: "documentation",
            label: "Documentation",
            icon: <HiCode className="text-purple-600" />,
        },
        {
            type: "course",
            label: "Courses",
            icon: <HiAcademicCap className="text-indigo-600" />,
        },
        {
            type: "dataset",
            label: "Datasets",
            icon: <HiDatabase className="text-pink-600" />,
        },
        {
            type: "cheatsheet",
            label: "Cheatsheets",
            icon: <FaFile className="text-orange-600" />,
        },
        {
            type: "practice",
            label: "Practice",
            icon: <FaFile className="text-cyan-600" />,
        },
        {
            type: "community",
            label: "Community",
            icon: <HiInformationCircle className="text-teal-600" />,
        },
    ];

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Filter and sort resources
    const filteredAndSortedResources = () => {
        let filtered = [...savedResources];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (resource) =>
                    resource.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    resource.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    resource.courseName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.savedAt);
            const dateB = new Date(b.savedAt);

            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    };

    const handleToggleSort = () => {
        setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRemoveSaved = (resourceId) => {
        Swal.fire({
            title: "Remove from saved resources?",
            text: "This will remove the resource from your saved collection",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Update both state and localStorage
                const updatedResources = savedResources.filter(
                    (r) => r.id !== resourceId
                );
                setSavedResources(updatedResources);
                localStorage.setItem(
                    "savedResources",
                    JSON.stringify(updatedResources)
                );

                Swal.fire(
                    "Removed!",
                    "The resource has been removed from your saved collection.",
                    "success"
                );
            }
        });
    };

    const navigateToCourse = (courseTitle) => {
        navigate(`/enrolledCourses/${courseTitle}/other-resources`);
    };

    // Get icon for resource type
    const getResourceIcon = (type) => {
        const resourceType = resourceTypes.find((rt) => rt.type === type);
        return resourceType ? resourceType.icon : <FaFile />;
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-color">
                        My Saved Resources
                    </h1>
                    <div className="text-sm text-gray-500">
                        {savedResources.length}{" "}
                        {savedResources.length === 1 ? "resource" : "resources"}{" "}
                        saved
                    </div>
                </div>

                {/* Search and Sort */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Search saved resources..."
                                className="w-full px-4 py-2 pl-10 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <button
                            onClick={handleToggleSort}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-gray-700 transition-colors"
                        >
                            {sortOrder === "newest" ? (
                                <FaSortAmountDown />
                            ) : (
                                <FaSortAmountUp />
                            )}
                            {sortOrder === "newest"
                                ? "Newest Saved"
                                : "Oldest Saved"}
                        </button>
                    </div>
                </div>

                {/* Resources List */}
                {filteredAndSortedResources().length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {filteredAndSortedResources().map((resource) => (
                                <motion.div
                                    key={resource.id}
                                    className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                                    variants={itemVariants}
                                >
                                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleRemoveSaved(resource.id)
                                            }
                                            className="p-2 bg-white bg-opacity-80 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors shadow-sm"
                                            title="Remove from saved"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>

                                    {resource.imageUrl && (
                                        <div className="h-40 overflow-hidden bg-gray-100">
                                            <img
                                                src={resource.imageUrl}
                                                alt={resource.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                {getResourceIcon(resource.type)}
                                                <span className="capitalize">
                                                    {resource.type}
                                                </span>
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Saved:{" "}
                                                {formatDate(resource.savedAt)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                                            {resource.title}
                                        </h3>
                                        {resource.creator && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                By {resource.creator}
                                            </p>
                                        )}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {resource.description}
                                        </p>

                                        <div className="flex flex-col gap-2 mt-4">
                                            <button
                                                onClick={() =>
                                                    navigateToCourse(
                                                        resource.courseTitle
                                                    )
                                                }
                                                className="text-sm text-purple-700 hover:text-purple-900 transition-colors font-medium"
                                            >
                                                From: {resource.courseName}
                                            </button>

                                            <a
                                                href={resource.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-center text-sm flex items-center justify-center gap-1"
                                            >
                                                View Resource{" "}
                                                <FaExternalLinkAlt className="text-xs" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-10">
                        <div className="flex justify-center mb-4">
                            <FaBookmark className="text-5xl text-gray-300" />
                        </div>
                        <p className="text-xl text-gray-500">
                            No saved resources found
                        </p>
                        {searchTerm ? (
                            <p className="mt-2 text-gray-400">
                                Try changing your search term
                            </p>
                        ) : (
                            <p className="mt-2 text-gray-400">
                                Bookmark useful resources to access them quickly
                                later
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedResources;
