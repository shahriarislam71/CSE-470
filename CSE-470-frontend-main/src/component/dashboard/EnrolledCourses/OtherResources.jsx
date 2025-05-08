import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
    FaExternalLinkAlt,
    FaBook,
    FaVideo,
    FaTools,
    FaFile,
    FaSearch,
    FaFilter,
    FaClock,
    FaSortAmountDown,
    FaSortAmountUp,
    FaEdit,
    FaBookmark,
    FaQuestion,
    FaUserCircle,
} from "react-icons/fa";
import {
    HiCode,
    HiDocumentText,
    HiAcademicCap,
    HiDatabase,
    HiInformationCircle,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../../../context/AuthProvider";
import Swal from "sweetalert2";

const OtherResources = () => {
    const { course } = useOutletContext() || {};
    const { courseTitle } = useParams();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [savedResources, setSavedResources] = useState([]);

    useEffect(() => {
        if (course && course.otherResources) {
            setResources(course.otherResources);

            // Load saved resources IDs from localStorage (in a real app, this would come from a database)
            const saved = JSON.parse(
                localStorage.getItem("savedResources") || "[]"
            );
            setSavedResources(saved);

            setLoading(false);
        }
    }, [course]);

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
            icon: <FaClock className="text-cyan-600" />,
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
        let filtered = [...resources];

        // Filter by tab
        if (activeTab !== "all") {
            filtered = filtered.filter(
                (resource) => resource.type === activeTab
            );
        }

        // Filter by selected types (if in "all" tab)
        if (activeTab === "all" && selectedTypes.length > 0) {
            filtered = filtered.filter((resource) =>
                selectedTypes.includes(resource.type)
            );
        }

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
                    (resource.author &&
                        resource.author
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                    (resource.creator &&
                        resource.creator
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                    (resource.contributorName &&
                        resource.contributorName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

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

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const toggleTypeFilter = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
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

    // Check if a resource is saved
    const isResourceSaved = (resourceId) => {
        return savedResources.some(
            (saved) =>
                saved.courseTitle === courseTitle &&
                saved.resourceId === resourceId
        );
    };

    // Toggle save/unsave resource
    const toggleSaveResource = (resource) => {
        const isSaved = isResourceSaved(resource.id);

        if (isSaved) {
            // Remove from saved
            const updatedSaved = savedResources.filter(
                (saved) =>
                    !(
                        saved.courseTitle === courseTitle &&
                        saved.resourceId === resource.id
                    )
            );
            setSavedResources(updatedSaved);
            localStorage.setItem(
                "savedResources",
                JSON.stringify(updatedSaved)
            );

            Swal.fire({
                title: "Resource Removed",
                text: "The resource has been removed from your saved collection",
                icon: "success",
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            // Add to saved
            const savedResource = {
                id: Date.now(),
                resourceId: resource.id,
                courseTitle: courseTitle,
                courseName: course.courseName,
                title: resource.title,
                type: resource.type,
                description: resource.description,
                imageUrl: resource.imageUrl,
                link: resource.link,
                creator: resource.creator || resource.author,
                date: resource.date,
                savedAt: new Date().toISOString().split("T")[0],
            };

            const updatedSaved = [...savedResources, savedResource];
            setSavedResources(updatedSaved);
            localStorage.setItem(
                "savedResources",
                JSON.stringify(updatedSaved)
            );

            Swal.fire({
                title: "Resource Saved",
                text: "The resource has been added to your saved collection",
                icon: "success",
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
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
                        Supplemental Resources
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                navigate(
                                    `/enrolledCourses/${courseTitle}/resources-tutorial`
                                )
                            }
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                            title="How to use this feature"
                        >
                            <FaQuestion /> Help
                        </button>
                        <button
                            onClick={() =>
                                navigate(
                                    `/enrolledCourses/${courseTitle}/manage-resources`
                                )
                            }
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <FaEdit /> Contribute Resources
                        </button>
                    </div>
                </div>

                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-700">
                        Browse helpful supplemental learning resources
                        contributed by students, instructors, and DCOs. Find
                        materials to enhance your learning experience or
                        contribute your own resources by clicking the
                        &quot;Contribute Resources&quot; button.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b mb-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                        <li className="mr-2">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`inline-block p-4 rounded-t-lg ${
                                    activeTab === "all"
                                        ? "text-purple-600 border-b-2 border-purple-600"
                                        : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
                                }`}
                            >
                                All Resources
                            </button>
                        </li>
                        {resourceTypes.map(
                            (type) =>
                                resources.some(
                                    (resource) => resource.type === type.type
                                ) && (
                                    <li key={type.type} className="mr-2">
                                        <button
                                            onClick={() =>
                                                setActiveTab(type.type)
                                            }
                                            className={`inline-flex items-center p-4 rounded-t-lg ${
                                                activeTab === type.type
                                                    ? "text-purple-600 border-b-2 border-purple-600"
                                                    : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
                                            }`}
                                        >
                                            <span className="mr-2">
                                                {type.icon}
                                            </span>
                                            {type.label}
                                        </button>
                                    </li>
                                )
                        )}
                    </ul>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="w-full px-4 py-2 pl-10 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleToggleSort}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-gray-700 transition-colors"
                            >
                                {sortOrder === "newest" ? (
                                    <FaSortAmountDown />
                                ) : (
                                    <FaSortAmountUp />
                                )}
                                {sortOrder === "newest" ? "Newest" : "Oldest"}
                            </button>

                            <button
                                onClick={toggleFilters}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-gray-700 transition-colors"
                            >
                                <FaFilter />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Expandable filters */}
                    {showFilters && (
                        <motion.div
                            className="mt-4 p-4 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <h3 className="font-medium text-gray-700 mb-2">
                                Filter by resource type:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {resourceTypes.map(
                                    (type) =>
                                        resources.some(
                                            (resource) =>
                                                resource.type === type.type
                                        ) && (
                                            <label
                                                key={type.type}
                                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                                                    selectedTypes.includes(
                                                        type.type
                                                    )
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(
                                                        type.type
                                                    )}
                                                    onChange={() =>
                                                        toggleTypeFilter(
                                                            type.type
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                                <span className="flex items-center gap-1">
                                                    {type.icon}
                                                    {type.label}
                                                </span>
                                            </label>
                                        )
                                )}
                            </div>
                        </motion.div>
                    )}
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
                                    <div className="absolute top-2 right-2 z-10">
                                        <button
                                            onClick={() =>
                                                toggleSaveResource(resource)
                                            }
                                            className={`p-2 bg-white bg-opacity-80 rounded-full ${
                                                isResourceSaved(resource.id)
                                                    ? "text-yellow-500 hover:text-yellow-600"
                                                    : "text-gray-400 hover:text-gray-600"
                                            } transition-colors shadow-sm`}
                                            title={
                                                isResourceSaved(resource.id)
                                                    ? "Remove from saved"
                                                    : "Save for later"
                                            }
                                        >
                                            <FaBookmark className="text-sm" />
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
                                                {formatDate(resource.date)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                                            {resource.title}
                                        </h3>
                                        {(resource.author ||
                                            resource.creator) && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                By{" "}
                                                {resource.author ||
                                                    resource.creator}
                                            </p>
                                        )}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {resource.description}
                                        </p>

                                        {resource.contributorName && (
                                            <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
                                                <FaUserCircle
                                                    className={`${
                                                        resource.contributorRole ===
                                                        "instructor"
                                                            ? "text-purple-600"
                                                            : resource.contributorRole ===
                                                              "dco"
                                                            ? "text-blue-600"
                                                            : "text-green-600"
                                                    }`}
                                                />
                                                <span>Contributed by: </span>
                                                <span className="font-medium">
                                                    {resource.contributorName}
                                                </span>
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded-full capitalize">
                                                    {resource.contributorRole ||
                                                        "student"}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div>
                                                {resource.duration && (
                                                    <span className="flex items-center text-xs text-gray-500">
                                                        <FaClock className="mr-1" />{" "}
                                                        {resource.duration}
                                                    </span>
                                                )}
                                                {resource.readTime && (
                                                    <span className="flex items-center text-xs text-gray-500">
                                                        <FaClock className="mr-1" />{" "}
                                                        {resource.readTime} read
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={resource.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
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
                        <p className="text-xl text-gray-500">
                            No resources found
                        </p>
                        {(searchTerm || selectedTypes.length > 0) && (
                            <p className="mt-2 text-gray-400">
                                Try changing your search or filters
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtherResources;
