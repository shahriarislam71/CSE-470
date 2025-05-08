import { useState, useEffect } from "react";
import {
    FaFilter,
    FaSearch,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";
import { MdPushPin } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const AllAnnouncements = () => {
    const [allAnnouncements, setAllAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
    const [filterImportant, setFilterImportant] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetch("/enrolledcourse.json")
            .then((response) => response.json())
            .then((courses) => {
                // Gather all announcements with course information
                const announcements = [];
                courses.forEach((course) => {
                    if (course.announcements) {
                        const courseAnnouncements = course.announcements.map(
                            (announcement) => ({
                                ...announcement,
                                courseTitle: course.courseTitle,
                                courseName: course.courseName,
                            })
                        );
                        announcements.push(...courseAnnouncements);
                    }
                });

                setAllAnnouncements(announcements);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading announcements:", error);
                setLoading(false);
            });
    }, []);

    // Format date function
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Get time ago from date
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} days ago`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths} months ago`;

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} years ago`;
    };

    // Filter and sort announcements
    const filteredAndSortedAnnouncements = () => {
        let filtered = [...allAnnouncements];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (ann) =>
                    ann.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    ann.content
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    ann.courseName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Apply important filter
        if (filterImportant) {
            filtered = filtered.filter((ann) => ann.important);
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

    const toggleImportantFilter = () => {
        setFilterImportant(!filterImportant);
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
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2 },
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
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-color">
                    All Announcements
                </h1>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Search announcements..."
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
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterImportant}
                                        onChange={toggleImportantFilter}
                                        className="w-4 h-4 accent-purple-600"
                                    />
                                    <span>Show only important</span>
                                </label>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Announcements List */}
                {filteredAndSortedAnnouncements().length > 0 ? (
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {filteredAndSortedAnnouncements().map(
                                (announcement) => (
                                    <motion.div
                                        key={`${announcement.courseTitle}-${announcement.id}`}
                                        className={`border rounded-lg overflow-hidden ${
                                            announcement.important
                                                ? "border-l-4 border-l-red-500"
                                                : ""
                                        }`}
                                        variants={itemVariants}
                                        layout
                                    >
                                        <div className="p-4 bg-white">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3 items-center">
                                                    <img
                                                        src={
                                                            announcement.authorAvatar
                                                        }
                                                        alt={
                                                            announcement.author
                                                        }
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {
                                                                announcement.author
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                announcement.authorRole
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(
                                                            announcement.date
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {getTimeAgo(
                                                            announcement.date
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center gap-2">
                                                    {announcement.important && (
                                                        <MdPushPin className="text-red-500" />
                                                    )}
                                                    <h2 className="text-xl font-bold text-[#012d5b]">
                                                        {announcement.title}
                                                    </h2>
                                                </div>
                                                <p className="mt-2 text-gray-700 whitespace-pre-line">
                                                    {announcement.content}
                                                </p>

                                                {/* Course badge */}
                                                <Link
                                                    to={`/enrolledCourses/${announcement.courseTitle}/announcement`}
                                                    className="inline-block mt-4 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                                                >
                                                    {announcement.courseName}
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-500">
                            No announcements found
                        </p>
                        {searchTerm && (
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

export default AllAnnouncements;
