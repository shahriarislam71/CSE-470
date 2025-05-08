import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Authcontext } from "../../../context/AuthProvider";
import Swal from "sweetalert2";

const CreateAnnouncement = () => {
    const { courseTitle } = useParams();
    const navigate = useNavigate();
    const { users } = useContext(Authcontext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isImportant, setIsImportant] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create announcement object
        const newAnnouncement = {
            id: Date.now(), // Simple ID generation
            title,
            content,
            date: new Date().toISOString(),
            author: users?.displayName || "Instructor",
            authorRole: "Instructor",
            authorAvatar:
                users?.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    users?.displayName || "Instructor"
                )}&background=8B5CF6&color=fff`,
            important: isImportant,
        };

        // In a real application, you would send this to your backend
        // For now, we'll simulate a successful submission
        setTimeout(() => {
            setIsSubmitting(false);

            // Show success message
            Swal.fire({
                title: "Announcement Created!",
                text: "Your announcement has been successfully published.",
                icon: "success",
                confirmButtonColor: "#8B5CF6",
            }).then(() => {
                // Redirect back to announcements page
                navigate(`/enrolledCourses/${courseTitle}/announcement`);
            });
        }, 1500);
    };

    const handleCancel = () => {
        if (title || content) {
            Swal.fire({
                title: "Discard changes?",
                text: "Your announcement draft will be lost.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#8B5CF6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, discard it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/enrolledCourses/${courseTitle}/announcement`);
                }
            });
        } else {
            navigate(`/enrolledCourses/${courseTitle}/announcement`);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-color">
                        Create Announcement
                    </h1>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block mb-2 text-lg font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                            placeholder="Enter announcement title"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="content"
                            className="block mb-2 text-lg font-medium text-gray-700"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 min-h-[200px]"
                            placeholder="Enter announcement content..."
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isImportant}
                                onChange={() => setIsImportant(!isImportant)}
                                className="w-4 h-4 accent-purple-600"
                                disabled={isSubmitting}
                            />
                            <span className="text-gray-700">
                                Mark as important
                            </span>
                            <FaExclamationTriangle
                                className={`text-yellow-500 ${
                                    isImportant ? "opacity-100" : "opacity-50"
                                }`}
                            />
                        </label>
                        {isImportant && (
                            <p className="text-sm text-gray-500 mt-1 ml-6">
                                Important announcements are highlighted and
                                appear at the top.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <motion.button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white rounded-lg font-medium shadow-md shadow-purple-300/30 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-300 flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle />
                                    Publish Announcement
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>

            {/* Preview Section */}
            {(title || content) && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Preview
                    </h2>
                    <div
                        className={`border rounded-lg overflow-hidden ${
                            isImportant ? "border-l-4 border-l-red-500" : ""
                        }`}
                    >
                        <div className="p-4 bg-white">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3 items-center">
                                    <img
                                        src={
                                            users?.photoURL ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                users?.displayName ||
                                                    "Instructor"
                                            )}&background=8B5CF6&color=fff`
                                        }
                                        alt="User Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold">
                                            {users?.displayName || "Instructor"}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Instructor
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Just now
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center gap-2">
                                    {isImportant && (
                                        <FaExclamationTriangle className="text-yellow-500" />
                                    )}
                                    <h2 className="text-xl font-bold text-[#012d5b]">
                                        {title || "Announcement Title"}
                                    </h2>
                                </div>
                                <p className="mt-2 text-gray-700 whitespace-pre-line">
                                    {content ||
                                        "Announcement content will appear here..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAnnouncement;
