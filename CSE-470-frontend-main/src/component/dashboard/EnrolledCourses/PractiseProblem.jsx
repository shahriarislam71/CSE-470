import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const Practiceproblem = () => {
    const { course } = useOutletContext(); // Get the course data from context
    console.log(course)
    const [selectedPracticeProblem, setSelectedPracticeproblem] = useState(null);
    const [showUpload, setShowUpload] = useState(false);

    return (
        <div className="p-6 w-5/6 h-full ">
            <h1 className="text-2xl font-bold mb-10 text-[#A855F7] text-center">Practice Problem for {course?.courseName}</h1>
            {course?.weeks?.map((week, index) => (
                <div key={index} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 secondarytext">Week {week.week}</h2>
                    {week.materials.map((material, idx) => (
                        material.type === "practice_problem" && (
                            <div key={idx}>
                                <button
                                    className="text-blue-500 hover:underline mb-2 pl-4"
                                    onClick={() => setSelectedPracticeproblem(material)}
                                >
                                    Practice Problem {week.week}
                                </button>
                            </div>
                        )
                    ))}
                </div>
            ))}

            {selectedPracticeProblem && (
                <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-lg font-semibold primarytext">{selectedPracticeProblem.title}</h3>
                    <p className="secondarytext">Questions: {selectedPracticeProblem.questions}</p>
                    <p className="secondarytext">Due Date: {new Date(selectedPracticeProblem.dueDate).toLocaleString()}</p>
                    <a href={selectedPracticeProblem.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Download Practice Problem
                    </a>
                </div>
            )}
        </div>
    );
};

export default Practiceproblem;
