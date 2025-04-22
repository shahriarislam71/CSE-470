import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const Video = () => {
    const { course } = useOutletContext(); // Get course data from context
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);

    return (
        <div className="p-4 w-5/6 h-full ">
            {/* Main Title */}
            <h2 className="text-2xl font-bold primarytext text-center mb-10">{course?.courseName} - Videos</h2>

            {/* Display selected video after the title */}
            {selectedVideo && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 secondarytext">{selectedTitle}</h3>
                    <video controls src={selectedVideo} className="w-full rounded-lg shadow-md" />
                </div>
            )}

            {/* Week-wise video list */}
            {course?.weeks?.map((week) => (
                <div key={week.week} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 secondarytext">Week {week.week}</h3>
                    {week.materials
                        .filter((material) => material.type === "video")
                        .map((video, index) => (
                            <div key={index} className="mb-2">
                                <button
                                    onClick={() => {
                                        setSelectedVideo(video.url);
                                        setSelectedTitle(video.title);
                                    }}
                                    className="text-blue-600 hover:underline pl-5"
                                >
                                    {video.title}
                                </button>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default Video;
