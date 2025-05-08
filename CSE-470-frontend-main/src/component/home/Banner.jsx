import { useContext, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Authcontext } from "../../context/AuthProvider";

const Banner = () => {
    const { users } = useContext(Authcontext);
    const [profileImage, setProfileImage] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    // Dynamic date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // Time of day greeting
    const getGreeting = () => {
        const hour = currentDate.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        // Default placeholder image using UI Avatars API
        const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            users?.displayName || "Student"
        )}&background=8B5CF6&color=fff&size=400`;

        if (users?.photoURL) {
            setProfileImage(users.photoURL);
        } else {
            // Use high-quality placeholder with user's name
            setProfileImage(fallbackImage);
        }
    }, [users?.photoURL, users?.displayName]);

    const handleImageError = () => {
        // Create a fallback image with user's name
        const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            users?.displayName || "Student"
        )}&background=8B5CF6&color=fff&size=400`;
        setProfileImage(fallbackImage);
        setImageLoaded(true);
    };

    return (
        <motion.div
            className="rounded-xl overflow-hidden shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <div className="relative w-full">
                {/* Background gradient */}
                <div className="absolute inset-0 background opacity-90"></div>

                {/* Content container */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-8 px-6 md:px-10">
                    {/* Text content */}
                    <motion.div
                        className="md:max-w-md mb-6 md:mb-0"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full mb-4">
                            {formattedDate}
                        </span>
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">
                            {getGreeting()}, {users?.displayName || "Student"}
                        </h2>
                        <p className="text-white/80 mb-6 text-lg">
                            Ready to continue your learning journey? You have{" "}
                            <span className="font-bold text-white">
                                3 pending tasks
                            </span>{" "}
                            for today.
                        </p>
                        <motion.button
                            className="px-5 py-2.5 bg-white text-purple-700 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-50 transition-colors duration-300 shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Go to My Tasks <FaArrowRight className="text-sm" />
                        </motion.button>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        className="relative rounded-lg overflow-hidden h-64 md:h-72 w-full md:w-[450px] shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-purple-800/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                            </div>
                        )}
                        <img
                            className={`h-full w-full object-cover rounded-lg transition-opacity duration-500 ${
                                imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            src={profileImage}
                            alt="Student Profile"
                            onLoad={() => setImageLoaded(true)}
                            onError={handleImageError}
                        />

                        {/* Decorative elements */}
                        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-yellow-400 rounded-full opacity-50 blur-xl"></div>
                        <div className="absolute -top-2 -left-2 w-16 h-16 bg-purple-500 rounded-full opacity-40 blur-xl"></div>
                    </motion.div>
                </div>

                {/* Decorative shapes */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl"></div>
            </div>
        </motion.div>
    );
};

export default Banner;
