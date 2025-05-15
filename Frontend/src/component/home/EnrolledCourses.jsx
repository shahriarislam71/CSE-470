import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  // console.log(courses)
  useEffect(() => {
    setCourses([
      {
        "coursePicture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgWVgzEpNo6FVTWvlowZngttxRheolOynDQ&s",
        "courseName": "Introduction to Programming",
        "courseTitle": "CSE110",
        "endTime": "2025-06-15T23:59:59Z",
        "weeks": [
          {
            "week": 1,
            "materials": [
              { "type": "video", "title": "Introduction to Programming", "url": "https://example.com/intro.mp4" },
              { "type": "lecture_notes", "title": "Programming Basics", "url": "https://example.com/notes.pdf" },
              { "type": "assignment", "title": "Basic Syntax", "questions": 10, "dueDate": "2024-12-03T23:59:00Z", "url": "https://example.com/assignment1.pdf" },
              { "type": "practice_problem", "title": "Loops & Conditions", "problems": 5, "url": "https://example.com/practice1.pdf" }
            ]
          },
          {
            "week": 2,
            "materials": [
              { "type": "video", "title": "Functions & Arrays", "url": "https://example.com/functions.mp4" },
              { "type": "lecture_notes", "title": "Understanding Functions", "url": "https://example.com/functions_notes.pdf" },
              { "type": "assignment", "title": "Array Operations", "questions": 8, "dueDate": "2024-12-10T23:59:00Z", "url": "https://example.com/assignment2.pdf" },
              { "type": "practice_problem", "title": "Function Challenges", "problems": 7, "url": "https://example.com/practice2.pdf" }
            ]
          }
        ],
        "announcements": [
          { "name": "John Doe", "photo": "https://example.com/john_doe.jpg", "date": "2025-02-10", "message": "Welcome to Introduction to Programming!" }
        ],
        "chatrooms": "https://example.com/chatroom_CSE110"
      },
      {
        "coursePicture": "https://www.shutterstock.com/image-photo/ai-artificial-intelligence-search-engine-600nw-2304697097.jpg",
        "courseName": "Data Science Essentials",
        "courseTitle": "CSE430",
        "endTime": "2025-07-10T23:59:59Z",
        "weeks": [
          {
            "week": 1,
            "materials": [
              { "type": "video", "title": "Introduction to Data Science", "url": "https://example.com/data_science_intro.mp4" },
              { "type": "lecture_notes", "title": "Data Science Overview", "url": "https://example.com/data_notes.pdf" },
              { "type": "assignment", "title": "Exploratory Data Analysis", "questions": 12, "dueDate": "2024-12-05T23:59:00Z", "url": "https://example.com/assignment3.pdf" },
              { "type": "practice_problem", "title": "Data Cleaning Challenges", "problems": 6, "url": "https://example.com/practice3.pdf" }
            ]
          }
        ],
        "announcements": [
          { "name": "Jane Smith", "photo": "https://example.com/jane_smith.jpg", "date": "2025-02-11", "message": "New assignments have been uploaded!" }
        ],
        "chatrooms": "https://example.com/chatroom_CSE430"
      },
      {
        "coursePicture": "https://t3.ftcdn.net/jpg/02/14/53/92/360_F_214539232_YnUrtuwUEt84gHuU0qG8l7OwZvH4rnPG.jpg",
        "courseName": "Web Development Bootcamp",
        "courseTitle": "CSE370",
        "endTime": "2025-08-05T23:59:59Z",
        "weeks": [
          {
            "week": 1,
            "materials": [
              { "type": "video", "title": "HTML & CSS Basics", "url": "https://example.com/html_css.mp4" },
              { "type": "lecture_notes", "title": "Introduction to Web Development", "url": "https://example.com/web_notes.pdf" },
              { "type": "assignment", "title": "Build a Simple Webpage", "questions": 5, "dueDate": "2024-12-10T23:59:00Z", "url": "https://example.com/assignment5.pdf" },
              { "type": "practice_problem", "title": "CSS Layout Challenges", "problems": 4, "url": "https://example.com/practice5.pdf" }
            ]
          }
        ],
        "announcements": [
          { "name": "Alice Brown", "photo": "https://example.com/alice_brown.jpg", "date": "2025-02-12", "message": "Course materials have been updated!" }
        ],
        "chatrooms": "https://example.com/chatroom_CSE370"
      },
      {
        "coursePicture": "https://media.istockphoto.com/id/966248982/photo/robot-with-education-hud.jpg?s=612x612&w=0&k=20&c=9eoZYRXNZsuU3edU87PksxN4Us-c9rB6IR7U_IGZ-U8=",
        "courseName": "Machine Learning with Python",
        "courseTitle": "CSE422",
        "endTime": "2025-09-20T23:59:59Z",
        "weeks": [
          {
            "week": 1,
            "materials": [
              { "type": "video", "title": "Introduction to ML", "url": "https://example.com/ml_intro.mp4" },
              { "type": "lecture_notes", "title": "What is Machine Learning?", "url": "https://example.com/ml_notes.pdf" },
              { "type": "assignment", "title": "Supervised Learning Basics", "questions": 10, "dueDate": "2024-12-12T23:59:00Z", "url": "https://example.com/assignment6.pdf" },
              { "type": "practice_problem", "title": "Regression Challenges", "problems": 6, "url": "https://example.com/practice6.pdf" }
            ]
          }
        ],
        "announcements": [
          { "name": "David Clark", "photo": "https://example.com/david_clark.jpg", "date": "2025-02-13", "message": "Discussion session will be held tomorrow." }
        ],
        "chatrooms": "https://example.com/chatroom_CSE422"
      },
      {
        "coursePicture": "https://www.theforage.com/blog/wp-content/uploads/2022/12/what-is-cybersecurity.jpg",
        "courseName": "Cybersecurity Fundamentals",
        "courseTitle": "CSE410",
        "endTime": "2025-10-12T23:59:59Z",
        "weeks": [
          {
            "week": 1,
            "materials": [
              { "type": "video", "title": "Cyber Threats Overview", "url": "https://example.com/cyber_threats.mp4" },
              { "type": "lecture_notes", "title": "Introduction to Cybersecurity", "url": "https://example.com/cybersecurity_notes.pdf" },
              { "type": "assignment", "title": "Security Protocols", "questions": 15, "dueDate": "2024-12-15T23:59:00Z", "url": "https://example.com/assignment7.pdf" },
              { "type": "practice_problem", "title": "Network Security Problems", "problems": 8, "url": "https://example.com/practice7.pdf" }
            ]
          }
        ],
        "announcements": [
          { "name": "Emma Johnson", "photo": "https://example.com/emma_johnson.jpg", "date": "2025-02-14", "message": "Reminder: Project deadline approaching!" }
        ],
        "chatrooms": "https://example.com/chatroom_CSE410"
      }
    ]
    )
  }, []);

  return (
    <div className='mt-8 ms-5'>
      {loading ? (
        <h1 className='text-color text-2xl font-bold'>Loading...</h1>
      ) : courses.length > 0 ? (
        <>
          <div className='flex justify-between items-center'>
            <h1 className='text-color text-2xl font-bold'>Enrolled Courses</h1>
            <button
              onClick={() => setShowAll(!showAll)}
              className='px-4 py-2 bg-[#8B5CF6] text-white font-medium rounded-md hover:bg-[#A855F7] transition-all duration-300'>
              {showAll ? "Show Less" : "See All"}
            </button>
          </div>

          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {(showAll ? courses : courses.slice(0, 3)).map((course, index) => (
              <motion.div
                key={index}
                className='border p-4 rounded-lg shadow-md bg-[#012d5b] cursor-pointer'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={course.coursePicture} alt={course.courseName} className='w-full h-40 object-cover rounded-md' />
                <h2 className='text-xl font-semibold mt-2 text-white'>{course.courseName}</h2>
                <p className='text-white'>{course.courseTitle}</p>
                <p className='text-sm text-white'>End Time: {new Date(course.endTime).toLocaleString()}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='mt-3 px-4 py-2 bg-[#8B5CF6] text-white rounded-md w-full font-medium hover:bg-[#A855F7] transition-all duration-300'
                >
                  <Link to={`/enrolledCourses/${course.courseTitle}`}>View Details</Link>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <h1 className='text-color text-2xl font-bold'>There is no Enrolled Courses</h1>
      )}
    </div>
  );
};

export default EnrolledCourses;
