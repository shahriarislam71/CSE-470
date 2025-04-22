import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const LectureNotes = () => {
    const { course } = useOutletContext(); // Get the course data from context
    console.log(course)
    const [selectedLectureNotes, setSelectedLectureNotes] = useState(null);

    return (
        <div className="p-6 w-5/6 h-full ">
            <h1 className="text-2xl font-bold mb-10 text-[#A855F7] text-center">Lecture Notes for {course?.courseName}</h1>
            {course?.weeks?.map((week, index) => (
                <div key={index} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 secondarytext">Week {week.week}</h2>
                    {week.materials.map((material, idx) => (
                        material.type === "lecture_notes" && (
                            <div key={idx}>
                                <button
                                    className="text-blue-500 hover:underline mb-2 pl-4"
                                    onClick={() => setSelectedLectureNotes(material)}
                                >
                                    Lecture Notes {week.week}
                                </button>
                            </div>
                        )
                    ))}
                </div>
            ))}

            {selectedLectureNotes && (
                <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-lg font-semibold primarytext">{selectedLectureNotes.title}</h3>
                    <p className="secondarytext">Questions: {selectedLectureNotes.questions}</p>
                    <p className="secondarytext">Due Date: {new Date(selectedLectureNotes.dueDate).toLocaleString()}</p>
                    <a href={selectedLectureNotes.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Download Lecture Notes
                    </a>
                </div>
            )}
        </div>
    );
};

export default LectureNotes;
