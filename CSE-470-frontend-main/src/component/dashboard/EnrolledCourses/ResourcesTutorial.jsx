import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBook,
    FaVideo,
    FaTools,
    FaBookmark,
    FaSearch,
    FaFilter,
    FaArrowRight,
    FaPlus,
    FaUserCircle,
} from "react-icons/fa";
import { HiCode, HiDocumentText, HiAcademicCap } from "react-icons/hi";
import { motion } from "framer-motion";

const ResourcesTutorial = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const totalSteps = 6;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate(-1); // Go back to previous page when tutorial is complete
        }
    };

    const handleSkip = () => {
        navigate(-1); // Go back to previous page
    };

    // Tutorial steps
    const steps = [
        {
            title: "Welcome to Supplemental Resources",
            content:
                "The Supplemental Resources feature provides additional learning materials to supplement your coursework. This tutorial will show you how to use and get the most out of this feature.",
            image: "https://img.freepik.com/free-vector/knowledge-concept-illustration_114360-3031.jpg",
        },
        {
            title: "Explore Different Resource Types",
            content:
                "Browse through various types of resources including books, videos, tools, documentation, articles, and more. Use the tabs to filter by specific resource types or view them all together.",
            image: "https://img.freepik.com/free-vector/self-study-concept-illustration_114360-7493.jpg",
        },
        {
            title: "Search and Filter",
            content:
                "Use the search bar to find specific resources by title, description, or author. Apply filters to narrow down your search results by date or resource type.",
            image: "https://img.freepik.com/free-vector/search-concept-landing-page_52683-20156.jpg",
        },
        {
            title: "Save Resources for Later",
            content:
                "Found a useful resource? Click the bookmark icon to save it to your personal collection. Access your saved resources anytime from the Saved Resources section in the main menu.",
            image: "https://img.freepik.com/free-vector/online-library-landing-page_52683-21124.jpg",
        },
        {
            title: "Contribute Your Own Resources",
            content:
                "Everyone can contribute! Click the 'Contribute Resources' button to add books, videos, tools, or any other resource you think would help your classmates. Resources from students, instructors, and DCOs all appear in the collection.",
            image: "https://img.freepik.com/free-vector/knowledge-sharing-abstract-concept_335657-3010.jpg",
        },
        {
            title: "Ready to Explore!",
            content:
                "You're all set! Start exploring and contributing to the wealth of resources available to enhance your learning experience. Remember, you can always access this tutorial again from the help section.",
            image: "https://img.freepik.com/free-vector/e-learning-education-home-banner_107791-8435.jpg",
        },
    ];

    const currentStepData = steps[currentStep - 1];

    // Animation variants
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-color">
                        Supplemental Resources Tutorial
                    </h1>
                    <div className="text-gray-500">
                        Step {currentStep} of {totalSteps}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{
                            width: `${(currentStep / totalSteps) * 100}%`,
                        }}
                    ></div>
                </div>

                {/* Tutorial Content */}
                <motion.div
                    key={currentStep}
                    initial="hidden"
                    animate="visible"
                    variants={contentVariants}
                    className="flex flex-col md:flex-row gap-8 items-center mb-8"
                >
                    <div className="md:w-1/2">
                        <h2 className="text-2xl font-bold mb-4 text-purple-700">
                            {currentStepData.title}
                        </h2>
                        <p className="text-gray-700 text-lg mb-6">
                            {currentStepData.content}
                        </p>

                        {/* Step-specific UI examples */}
                        {currentStep === 2 && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                                    <FaBook /> Books
                                </div>
                                <div className="px-3 py-2 bg-red-100 text-red-700 rounded-full flex items-center gap-2">
                                    <FaVideo /> Videos
                                </div>
                                <div className="px-3 py-2 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                                    <FaTools /> Tools
                                </div>
                                <div className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full flex items-center gap-2">
                                    <HiCode /> Documentation
                                </div>
                                <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-2">
                                    <HiDocumentText /> Articles
                                </div>
                                <div className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-2">
                                    <HiAcademicCap /> Courses
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="mt-4 space-y-3">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Search resources..."
                                        className="w-full px-4 py-2 pl-10 border-2 border-purple-300 rounded-lg"
                                        disabled
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700">
                                        <FaFilter /> Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="mt-4 flex flex-col gap-3">
                                <div className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">
                                            Python Tutorial
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Interactive guide to Python
                                            programming
                                        </p>
                                    </div>
                                    <button className="p-2 bg-gray-100 rounded-full text-yellow-500">
                                        <FaBookmark />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-purple-600">
                                    <FaBookmark className="text-yellow-500" />
                                    <span>Saved to your collection</span>
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="mt-4 flex flex-col gap-3">
                                <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-semibold">
                                            Contribute Resources
                                        </h3>
                                        <button className="p-1 bg-purple-100 rounded text-purple-600">
                                            <FaPlus size={14} />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        Add resources to help your classmates!
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <FaUserCircle className="text-green-600" />
                                        <span>Contributed by: </span>
                                        <span className="font-medium">You</span>
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                                            student
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:w-1/2">
                        <img
                            src={currentStepData.image}
                            alt={`Tutorial step ${currentStep}`}
                            className="rounded-lg shadow-md w-full h-auto max-h-80 object-cover"
                        />
                    </div>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        {currentStep < totalSteps ? "Skip Tutorial" : "Close"}
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                    >
                        {currentStep < totalSteps ? (
                            <>
                                Next <FaArrowRight />
                            </>
                        ) : (
                            "Finish"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourcesTutorial;
