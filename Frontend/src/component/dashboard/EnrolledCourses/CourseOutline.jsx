import { useState } from "react";
import { FaBookOpen, FaChevronDown, FaChevronUp, FaQuestionCircle, FaStar } from "react-icons/fa";

// Dummy Course Data
const dummyCourse = {
  courseId: "CSE110",
  courseName: "Introduction to Computer Science",
  instructor: {
    name: "Dr. Jane Smith",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "PhD in Computer Science from MIT. Passionate about algorithms, problem solving, and helping students learn by doing.",
  },
  weeks: [
    {
      week: 1,
      topics: [
        { type: "lecture", title: "What is Computer Science?" },
        { type: "lecture", title: "History of Computing" },
        { type: "quiz", title: "Quiz: Basics" },
      ],
    },
    {
      week: 2,
      topics: [
        { type: "lecture", title: "Binary & Data Representation" },
        { type: "lecture", title: "Logic Gates" },
        { type: "quiz", title: "Quiz: Logic & Binary" },
      ],
    },
    {
      week: 3,
      topics: [
        { type: "lecture", title: "Introduction to Programming" },
        { type: "midterm", title: "Midterm Exam" },
      ],
    },
  ],
};

const iconMap = {
  lecture: <FaBookOpen className="text-purple-600" />,
  quiz: <FaQuestionCircle className="text-red-500" />,
  midterm: <FaStar className="text-yellow-500" />,
};

const CourseOutline = () => {
  const course = dummyCourse;
  const [openWeeks, setOpenWeeks] = useState(() =>
    course.weeks.map(() => true)
  );

  const toggleWeek = (index) => {
    setOpenWeeks((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10">
      {/* Course Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-6 rounded-xl max-w-6xl mx-auto mb-10 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{course.courseName}</h1>
        <p className="text-md text-purple-100">
          Course Outline & Weekly Breakdown
        </p>
      </div>

      {/* Instructor Card */}
      <div className="max-w-4xl mx-auto mb-10 px-6">
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6">
          <img
            src={course.instructor.img}
            alt={course.instructor.name}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {course.instructor.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {course.instructor.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Outline Accordion */}
      <div className="max-w-5xl mx-auto px-6 space-y-6">
        {course.weeks.map((week, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden border"
          >
            {/* Accordion Header */}
            <div
              className="flex justify-between items-center px-6 py-4 bg-purple-100 cursor-pointer"
              onClick={() => toggleWeek(index)}
            >
              <h3 className="text-xl font-semibold text-purple-800">
                📚 Week {week.week}
              </h3>
              <span className="text-purple-700 text-xl">
                {openWeeks[index] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {/* Accordion Content */}
            {openWeeks[index] && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 py-5 bg-gray-50">
                {week.topics.map((topic, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all flex gap-3 items-start"
                  >
                    <div className="text-2xl">{iconMap[topic.type]}</div>
                    <div>
                      <p className="text-md font-medium text-gray-800">
                        {topic.title}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {topic.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOutline;
