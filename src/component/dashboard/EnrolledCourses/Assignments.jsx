import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const Assignment = () => {
    const { course } = useOutletContext(); // Get the course data from context
    console.log(course)
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showUpload, setShowUpload] = useState(false);

    return (
        <div className="p-6 w-5/6 h-full ">
            <h1 className="text-2xl font-bold mb-10 text-[#A855F7] text-center">Assignments for {course?.courseName}</h1>
            {course?.weeks?.map((week, index) => (
                <div key={index} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 secondarytext">Week {week.week}</h2>
                    {week.materials.map((material, idx) => (
                        material.type === "assignment" && (
                            <div key={idx}>
                                <button
                                    className="text-blue-500 hover:underline mb-2 pl-4"
                                    onClick={() => setSelectedAssignment(material)}
                                >
                                    Assignment {week.week}
                                </button>
                            </div>
                        )
                    ))}
                </div>
            ))}

            {selectedAssignment && (
                <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-lg font-semibold primarytext">{selectedAssignment.title}</h3>
                    <p className="secondarytext">Questions: {selectedAssignment.questions}</p>
                    <p className="secondarytext">Due Date: {new Date(selectedAssignment.dueDate).toLocaleString()}</p>
                    <a href={selectedAssignment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Download Assignment
                    </a>
                    <div className="mt-4">
                        <button title="Upload Assignments"
                            className="w-10 h-10 rounded-full primarybg text-lg text-white font-bold"
                            onClick={() => setShowUpload(!showUpload)}
                        >
                            {showUpload ? "-" : "+"}
                        </button>
                        {showUpload && (
                            <input
                                type="file"
                                className="block mt-2 border-[#A855F7] rounded border p-2"
                                onChange={(e) => console.log("File Uploaded:", e.target.files[0])} // Handle file upload
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignment;
