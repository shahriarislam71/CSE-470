import { useContext } from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
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
import Chatrooms from "../component/dashboard/studentDashboard/Chatrooms";
import Connect from "../component/dashboard/studentDashboard/Connect";
import Course from "../component/dashboard/studentDashboard/Course";
import Groups from "../component/dashboard/studentDashboard/Groups";
import Inbox from "../component/dashboard/studentDashboard/Inbox";
import Home from "../component/home/Home";
import Login from "../component/otherspage/Login";
import SignUp from "../component/otherspage/Signup";
import { Authcontext } from '../context/AuthProvider';
import EnrolledCourseSideBar from "../layout/EnrolledCourseSideBar";
import StudentDashboard from "../layout/StudentDashboard";

const Protected = ({ children }) => {
  const { users, loading } = useContext(Authcontext);

  if (loading) {
    return <p>Loading...</p>; // or a nice spinner
  }

  if (!users) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const route = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path: "/home",
      element:(<Protected>
        <StudentDashboard />
        </Protected> ),
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'course',
          element: <Course />
        },
        {
          path: 'chatrooms',
          element: <Chatrooms />
        },
        {
          path: 'connect',
          element: <Connect />
        },
        {
          path: 'inbox',
          element: <Inbox />
        },
        {
          path: "group",
          element: <Groups />
        }
      ]
    },

    {
      path: "enrolledCourses/:courseTitle",
      element: <EnrolledCourseSideBar />, 
      children: [
          
          { path: 'course-outline', element: <CourseOutline></CourseOutline> },
          { path: 'assignments', element: <Assignments></Assignments> },
          { path: 'videos', element: <Video />},
          { path: 'practiceproblem', element: <Practiceproblem></Practiceproblem>},
          { path: 'studentresources', element: <Studentresourses></Studentresourses>},
          { path: 'lecturenotes', element: <LectureNotes />},
          { path: 'other-resources', element: <OtherResources />},
          { path: 'chatroom', element: <Chatroom />},
          { path: 'archive', element: <Archive />},
          { path: 'unenroll', element: <Unenroll />},
          { path: 'announcement', element: <Announcement />}
      ]
  }
  ])

  export default route