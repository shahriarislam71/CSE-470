import { useOutletContext } from "react-router-dom";

const Assignments = () => {
  const { course } = useOutletContext() || {};

  // Fallback dummy data
  const dummyCourse = {
    courseName: "Sample Course",
    weeks: [
      {
        week: 1,
        materials: [
          {
            type: "assignment",
            title: "Assignment 1",
            questions: "Solve problems from chapter 3 and 4.",
            dueDate: new Date().toISOString(),
            url: "https://example.com/sample-assignment1.pdf",
          },
        ],
      },
      {
        week: 2,
        materials: [
          {
            type: "assignment",
            title: "Assignment 2",
            questions: "Essay on AI and Education.",
            dueDate: new Date().toISOString(),
            url: "https://example.com/sample-assignment2.pdf",
          },
        ],
      },
    ],
  };

  const displayCourse = course?.weeks ? course : dummyCourse;

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-10">
        Assignments for {displayCourse.courseName}
      </h1>

      {displayCourse.weeks.map((week, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Week {week.week}
          </h2>

          {week.materials
            .filter((m) => m.type === "assignment")
            .map((assignment, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-all hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                  {assignment.title}
                </h3>
                <p className="text-gray-700 mb-1">
                  <strong>Questions:</strong> {assignment.questions}
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Due Date:</strong>{" "}
                  {new Date(assignment.dueDate).toLocaleString()}
                </p>
                <a
                  href={assignment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition"
                >
                  📄 Download Assignment
                </a>

                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <label
                    htmlFor={`upload-${idx}`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload your solution:
                  </label>

                  <label
                    htmlFor={`upload-${idx}`}
                    className="cursor-pointer inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    Choose File
                  </label>

                  <input
                    id={`upload-${idx}`}
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      console.log("File uploaded:", e.target.files[0])
                    }
                  />

                  <span className="ml-4 text-sm text-gray-600">
                    No file chosen
                  </span>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Assignments;
