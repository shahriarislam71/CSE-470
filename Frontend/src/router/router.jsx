import { useContext } from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../component/otherspage/Login";
import SignUp from "../component/otherspage/Signup";

import Chatrooms from "../component/dashboard/studentDashboard/Chatrooms";
import Connect from "../component/dashboard/studentDashboard/Connect";
import Course from "../component/dashboard/studentDashboard/Course";
import Groups from "../component/dashboard/studentDashboard/Groups";
import Inbox from "../component/dashboard/studentDashboard/Inbox";
import Home from "../component/home/Home";
import StudentDashboard from "../layout/StudentDashboard";

import CreateCourse from "../component/dashboard/teacherDashboard/CreateCourse";
import Dashboard from "../component/dashboard/teacherDashboard/Dashboard";
import TeacherInbox from "../component/dashboard/teacherDashboard/TeacherInbox";
import TeacherDashboard from "../layout/TeacherLayout";

import Announcement from "../component/dashboard/EnrolledCourses/Announcement";
import Archive from "../component/dashboard/EnrolledCourses/Archive";
import Assignments from "../component/dashboard/EnrolledCourses/Assignments";
import Chatroom from "../component/dashboard/EnrolledCourses/ChatRoom";
import CourseOutline from '../component/dashboard/EnrolledCourses/CourseOutline';
import LectureNotes from "../component/dashboard/EnrolledCourses/LectureNotes";
import OtherResources from "../component/dashboard/EnrolledCourses/OtherResources";
import Practiceproblem from "../component/dashboard/EnrolledCourses/PractiseProblem";
import Studentresourses from "../component/dashboard/EnrolledCourses/StudentResourses";
import Unenroll from "../component/dashboard/EnrolledCourses/UnEnroll";
import Video from "../component/dashboard/EnrolledCourses/Video";
import EnrolledCourseSideBar from "../layout/EnrolledCourseSideBar";

import { Authcontext } from '../context/AuthProvider';
import AdminDashboard from '../layout/AdminDashboard';
import AddStudent from '../component/dashboard/AdminDashboard/AddStudent';
import AddTeacher from '../component/dashboard/AdminDashboard/AddTeacher';
import AdminDashboardHome from '../component/dashboard/AdminDashboard/AdminDashboardHome';
import CourseManagementLayout from '../layout/CourseManagementLayout';
import CourseOverview from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseOverview';
import CreateSection from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CreateSection';
import CourseSections from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseSections';
import CourseAnnouncements from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseAnnouncements';
import CourseStudents from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseStudents';
import AddStudents from '../component/dashboard/teacherDashboard/teacherCourseDashboard/AddStudents';
import CourseChatrooms from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseChatrooms';
import CourseAssignments from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseAssignments';
import CourseMaterials from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseMaterials';
import CourseVideos from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseVideos';
import CourseNotes from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CourseNotes';
import CoursePractice from '../component/dashboard/teacherDashboard/teacherCourseDashboard/CoursePractice';
import SectionAnnouncements from '../component/dashboard/teacherDashboard/teacherCourseDashboard/SectionAnnouncements';
import SectionStudents from '../component/dashboard/teacherDashboard/teacherCourseDashboard/SectionStudents';
import SectionChatrooms from '../component/dashboard/teacherDashboard/teacherCourseDashboard/SectionChatrooms';
import SectionAssignments from '../component/dashboard/teacherDashboard/teacherCourseDashboard/SectionAssignments';

// Generic error page for route errors
function ErrorPage({ error }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  );
}

// Protected route wrapper
const Protected = ({ children }) => {
  const { users, loading } = useContext(Authcontext);

  if (loading) {
    return <p>Loading...</p>; // You can replace with spinner
  }

  if (!users) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/home',
    element: (
      <Protected>
        <StudentDashboard />
      </Protected>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'course', element: <Course /> },
      { path: 'chatrooms', element: <Chatrooms /> },
      { path: 'connect', element: <Connect /> },
      { path: 'inbox', element: <Inbox /> },
      { path: 'group', element: <Groups /> },
    ],
  },
  {
    path: 'enrolledCourses/:courseTitle',
    element: (
      <Protected>
        <EnrolledCourseSideBar />
      </Protected>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: 'course-outline', element: <CourseOutline /> },
      { path: 'assignments', element: <Assignments /> },
      { path: 'videos', element: <Video /> },
      { path: 'practiceproblem', element: <Practiceproblem /> },
      { path: 'studentresources', element: <Studentresourses /> },
      { path: 'lecturenotes', element: <LectureNotes /> },
      { path: 'other-resources', element: <OtherResources /> },
      { path: 'chatroom', element: <Chatroom /> },
      { path: 'archive', element: <Archive /> },
      { path: 'unenroll', element: <Unenroll /> },
      { path: 'announcement', element: <Announcement /> },
    ],
  },
  {
    path: '/teacher',
    element: (
      <Protected>
        <TeacherDashboard />
      </Protected>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'create-course', element: <CreateCourse /> },
      { path: 'inbox', element: <TeacherInbox /> },
    ],
  },
  {
  path: '/admin',
  element: (
    <Protected>
      <AdminDashboard />
    </Protected>
  ),
  errorElement: <ErrorPage />,
  children: [
    { index: true, element: <AdminDashboardHome /> },
    { path: 'dashboard', element: <AdminDashboardHome /> },
    { path: 'add-student', element: <AddStudent /> },
    { path: 'add-teacher', element: <AddTeacher /> },
  ],
},

{
  path: '/teacher/courses/:courseId',
  element: (
    <Protected>
      <CourseManagementLayout />
    </Protected>
  ),
  errorElement: <ErrorPage />,
  children: [
    { index: true, element: <CourseOverview /> },
    { path: 'overview', element: <CourseOverview /> },
    // Course Materials
    { path: 'materials', element: <CourseMaterials /> },
    { path: 'materials/videos', element: <CourseVideos /> },
    { path: 'materials/notes', element: <CourseNotes /> },
    { path: 'materials/practice', element: <CoursePractice /> },
    // Section-specific routes
    { 
      path: 'sections/:sectionId',
      children: [
        { path: 'announcements', element: <SectionAnnouncements /> },
        { path: 'students', element: <SectionStudents /> },
        // { path: 'add-students', element: <AddStudentsToSection /> },
        { path: 'chatrooms', element: <SectionChatrooms /> },
        { path: 'assignments', element: <SectionAssignments /> }
      ]
    }
  ],
}
]);

export default router;
