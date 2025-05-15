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
]);

export default router;
