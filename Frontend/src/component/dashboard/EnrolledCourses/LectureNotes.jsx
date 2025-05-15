import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import Modal1 from "../../modal/modal1"; // Adjust if needed

const lectureNotesData = [
  {
    week: 1,
    notes: [
      {
        title: "Week 1 Introduction",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
      },
      {
        title: "Summary Sheet",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
      },
    ],
  },
  {
    week: 2,
    notes: [
      {
        title: "Week 2 Concepts",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
      },
      {
        title: "Cheatsheet",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
      },
    ],
  },
];

const LectureNotes = () => {
  const [previewNote, setPreviewNote] = useState(null);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-4">
      {/* Top Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-600">📚 Lecture Notes</h1>
        <p className="text-gray-500 mt-2">All weekly resources shared by your instructor</p>
      </div>

      {/* Weekly Notes */}
      {lectureNotesData.map((weekData, index) => (
        <div
          key={index}
          className="mb-12 bg-white shadow-xl rounded-xl p-6 border border-purple-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-2">
            📘 Week {weekData.week}
          </h2>

          {weekData.notes.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-2 scroll-smooth">
              {weekData.notes.map((note, idx) => (
                <div
                  key={idx}
                  className="min-w-[270px] bg-gray-50 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between p-4 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center gap-2 text-purple-700 mb-3">
                    <FaFilePdf size={22} />
                    <h3 className="font-semibold truncate text-md">{note.title}</h3>
                  </div>

                  <span className="text-xs text-gray-500 mb-2">PDF file</span>

                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => setPreviewNote(note)}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
                    >
                      Preview
                    </button>
                    <a
                      href={note.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No notes added for this week.</p>
          )}
        </div>
      ))}

      {/* Modal Preview */}
      {previewNote && (
        <Modal1
          title={previewNote.title}
          fileUrl={previewNote.fileUrl}
          onClose={() => setPreviewNote(null)}
        />
      )}
    </div>
  );
};

export default LectureNotes;
