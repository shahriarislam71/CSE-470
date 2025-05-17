import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddStudentsToSection = () => {
  const { courseId, sectionName } = useParams();
  const [studentEmail, setStudentEmail] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [existingStudents, setExistingStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch course details and existing students
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`http://localhost:5000/courses/${courseId}`);
        const courseData = await courseRes.json();
        setCourseDetails(courseData);

        // Fetch existing students in this section
        if (courseData.courseCode && sectionName) {
          const studentsRes = await fetch(
            `http://localhost:5000/section-students?courseCode=${courseData.courseCode}&section=${sectionName}`
          );
          const studentsData = await studentsRes.json();
          setExistingStudents(studentsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [courseId, sectionName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check if student already exists in this section
    if (existingStudents.some(student => student.email === studentEmail)) {
      Swal.fire({
        title: 'Already Exists',
        text: 'This student is already in the section',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/section-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: studentEmail,
          teacherEmail: courseDetails?.email,
          courseCode: courseDetails?.courseCode,
          courseId,
          section: sectionName,
          status: 'pending'
        })
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Student added successfully to the section',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Refresh the list of students
        const studentsRes = await fetch(
          `http://localhost:5000/section-students?courseCode=${courseDetails.courseCode}&section=${sectionName}`
        );
        const studentsData = await studentsRes.json();
        setExistingStudents(studentsData);
        setStudentEmail('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to add student',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Students in Section: {sectionName}
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Course Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {courseDetails && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Course Name</p>
                <p className="font-medium">{courseDetails.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Code</p>
                <p className="font-medium">{courseDetails.courseCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Faculty</p>
                <p className="font-medium">{courseDetails.facultyInitial}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Student</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Student Email
              </label>
              <input
                type="email"
                id="studentEmail"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter student's email address"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                The student will receive an invitation to join this section.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  isLoading
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } transition-colors`}
              >
                {isLoading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Students in this Section</h3>
          {existingStudents.length > 0 ? (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {existingStudents.map((student) => (
                  <li key={student._id} className="p-3 hover:bg-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{student.email}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
              No students have been added to this section yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentsToSection;