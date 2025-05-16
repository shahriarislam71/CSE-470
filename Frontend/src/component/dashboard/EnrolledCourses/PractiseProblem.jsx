import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaClock, FaEye, FaFileDownload } from "react-icons/fa";
import Modal1 from "../../modal/modal1";

const dummyPracticeSheets = [
  {
    id: 1,
    week: 1,
    title: "Basic Python Loops",
    description: "Practice problems on for/while loops.",
    difficulty: "Easy",
    estimatedTime: "30 mins",
    problems: 5,
    fileUrl: "https://example.com/sheet1.pdf",
  },
  {
    id: 2,
    week: 1,
    title: "List Challenges",
    description: "Data structure problems with lists.",
    difficulty: "Medium",
    estimatedTime: "45 mins",
    problems: 8,
    fileUrl: "https://example.com/sheet2.pdf",
  },
  {
    id: 3,
    week: 1,
    title: "Dictionary Problems",
    description: "Advanced dict usage.",
    difficulty: "Medium",
    estimatedTime: "40 mins",
    problems: 6,
    fileUrl: "https://example.com/sheet3.pdf",
  },
  {
    id: 4,
    week: 1,
    title: "String Manipulation",
    description: "Work with strings and patterns.",
    difficulty: "Easy",
    estimatedTime: "30 mins",
    problems: 4,
    fileUrl: "https://example.com/sheet4.pdf",
  },
  {
    id: 5,
    week: 1,
    title: "Nested Loops",
    description: "Logic with nested loops.",
    difficulty: "Hard",
    estimatedTime: "50 mins",
    problems: 7,
    fileUrl: "https://example.com/sheet5.pdf",
  },
  {
    id: 6,
    week: 1,
    title: "Final Loop Set",
    description: "Wrap-up loop challenges.",
    difficulty: "Medium",
    estimatedTime: "35 mins",
    problems: 6,
    fileUrl: "https://example.com/sheet6.pdf",
  },
  {
    id: 7,
    week: 2,
    title: "Recursion Basics",
    description: "Recursive thinking problems.",
    difficulty: "Medium",
    estimatedTime: "40 mins",
    problems: 6,
    fileUrl: "https://example.com/sheet7.pdf",
  },
];

const PracticeProblem = () => {
  const [previewSheet, setPreviewSheet] = useState(null);
  const sliders = useRef({});

  const groupedByWeek = dummyPracticeSheets.reduce((acc, sheet) => {
    acc[sheet.week] = acc[sheet.week] || [];
    acc[sheet.week].push(sheet);
    return acc;
  }, {});

  const scroll = (week, direction) => {
    const slider = sliders.current[week];
    if (slider) {
      const scrollAmount = direction === "left" ? -300 : 300;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-10">Practice Sheets</h1>

      {Object.entries(groupedByWeek).map(([week, sheets]) => (
        <div key={week} className="mb-14">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-2xl font-semibold text-gray-800">Week {week}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(week, "left")}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => scroll(week, "right")}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div
            className="flex gap-4 overflow-x-auto no-scrollbar px-2"
            ref={(el) => (sliders.current[week] = el)}
          >
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className="min-w-[300px] bg-white shadow-md rounded-xl p-5 shrink-0 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{sheet.title}</h3>
                <p className="text-gray-600 mb-2">{sheet.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{sheet.difficulty}</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-gray-400" /> {sheet.estimatedTime}
                  </span>
                  <span>{sheet.problems} Problems</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreviewSheet(sheet)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded shadow text-sm"
                  >
                    <FaEye /> Preview
                  </button>
                  <a
                    href={sheet.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded shadow text-sm"
                  >
                    <FaFileDownload /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal usage */}
      {previewSheet && (
        <Modal1
          title={previewSheet.title}
          fileUrl={previewSheet.fileUrl}
          onClose={() => setPreviewSheet(null)}
        />
      )}
      
    </div>
  );
};

export default PracticeProblem;
