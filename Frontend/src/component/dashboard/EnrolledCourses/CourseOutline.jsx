import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseOutline = () => {
  const { courseTitle } = useParams(); // 🔥 Get course ID from URL (e.g. "CSE430")
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/courseOutlines')
      .then((res) => {
        const matchedCourse = res.data.find(c => c.courseId === courseTitle);
        setCourse(matchedCourse || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch course outline", err);
        setLoading(false);
      });
  }, [courseTitle]);

  if (loading) return <p className="text-center mt-10">Loading Course Outline...</p>;

  if (!course) {
    return (
      <p className="text-center text-red-600 mt-10">
        No course outline found for "<strong>{courseTitle}</strong>" 😕
      </p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Course Heading */}
      <h1 className="text-3xl font-bold primarytext text-center">{course.courseName}</h1>

      {/* Teacher Info */}
      <div className="flex flex-row items-start gap-6 p-4">
        <img
          src={course.instructor.img}
          alt={course.instructor.name}
          className="w-56 h-56 rounded-xl object-cover border"
        />
        <div>
          <h2 className="text-blue-900 text-xl font-semibold pt-4">{course.instructor.name}</h2>
          <p className="text-gray-600 text-sm">{course.instructor.bio}</p>
        </div>
      </div>

      {/* Weekly Content */}
      <div className="space-y-6">
        {course.weeks.map((week, index) => (
          <div key={index} className="bg-white p-4 rounded-md border shadow-sm">
            <h3 className="text-lg font-bold text-blue-700 mb-2">📆 Week {week.week}</h3>
            <div className="space-y-2">
              {week.topics.map((topic, i) => {
                if (topic.type === "midterm") {
                  return (
                    <div key={i}>
                      <hr className="border-dotted border-gray-400 my-2" />
                      <div className="bg-yellow-300 text-black font-semibold px-4 py-2 rounded">
                        ⭐ {topic.title}
                      </div>
                    </div>
                  );
                }

                if (topic.type === "quiz") {
                  return (
                    <div
                      key={i}
                      className="bg-red-600 text-white px-4 py-2 rounded font-medium"
                    >
                      ➤ {topic.title}
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className="secondarybg text-white px-4 py-2 rounded"
                  >
                    ➤ {topic.title}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOutline;
