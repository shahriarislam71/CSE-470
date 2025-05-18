import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Authcontext } from '../../context/AuthProvider';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(null);
  const {users} = useContext(Authcontext)
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const studentEmail = localStorage.getItem('email') || 'shahriar.islam.rafi@g.bracu.ac.bd';
        
        // Fetch enrolled courses
        const enrolledResponse = await axios.get(`http://localhost:5000/enrolled-courses`, {
          params: { email: studentEmail }
        });
        
        if (enrolledResponse.data?.length > 0) {
          // Fetch section information
          const sectionsResponse = await axios.get(`http://localhost:5000/section-students`, {
            params: { email: studentEmail }
          });

          const enrichedCourses = await Promise.all(
            enrolledResponse.data.map(async (enrollment) => {
              try {
                const courseResponse = await axios.get(`http://localhost:5000/courses/${enrollment.courseId}`);
                // Find the section for this course
                const sectionInfo = sectionsResponse.data.find(
                  s => s.courseCode === enrollment.courseCode
                );
                
                return {
                  ...enrollment,
                  section: sectionInfo?.section || 'Default Section',
                  coursePicture: courseResponse.data?.imageUrl || 'https://via.placeholder.com/150',
                  endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                  weeks: [],
                  announcements: [],
                  chatrooms: `http://localhost:5000/chatroom_${enrollment.courseCode}`
                };
              } catch (err) {
                console.error(`Error fetching details for course ${enrollment.courseId}:`, err);
                return {
                  ...enrollment,
                  section: 'Default Section',
                  coursePicture: 'https://via.placeholder.com/150',
                  endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                  weeks: [],
                  announcements: [],
                  chatrooms: `http://localhost:5000/chatroom_${enrollment.courseCode}`
                };
              }
            })
          );
          setCourses(enrichedCourses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load enrolled courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className='mt-8 ms-5'>
      {loading ? (
        <h1 className='text-color text-2xl font-bold'>Loading...</h1>
      ) : error ? (
        <h1 className='text-color text-2xl font-bold'>{error}</h1>
      ) : courses.length > 0 ? (
        <>
          <div className='flex justify-between items-center'>
            <h1 className='text-color text-2xl font-bold'>Enrolled Courses</h1>
            {courses.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className='px-4 py-2 bg-[#8B5CF6] text-white font-medium rounded-md hover:bg-[#A855F7] transition-all duration-300'>
                {showAll ? "Show Less" : "See All"}
              </button>
            )}
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
                <img 
                  src={course.coursePicture} 
                  alt={course.courseName} 
                  className='w-full h-40 object-cover rounded-md' 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <h2 className='text-xl font-semibold mt-2 text-white'>{course.courseName}</h2>
                <p className='text-white'>{course.courseCode}</p>
                <p className='text-sm text-white'>Faculty: {course.facultyInitial}</p>
                <p className='text-sm text-white'>Section: {course.section}</p>
                <p className='text-sm text-white'>
                  Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='mt-3 px-4 py-2 bg-[#8B5CF6] text-white rounded-md w-full font-medium hover:bg-[#A855F7] transition-all duration-300'
                >
                  <Link 
                    to={`/enrolledCourses/${course.courseCode}`}
                    state={{ 
                      sectionName: course.section,
                      courseData: course // Pass entire course data if needed
                    }}
                  >
                    View Details
                  </Link>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <h1 className='text-color text-2xl font-bold'>You are not enrolled in any courses yet</h1>
      )}
    </div>
  );
};

export default EnrolledCourses;