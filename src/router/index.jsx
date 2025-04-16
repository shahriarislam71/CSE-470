import { createBrowserRouter } from "react-router-dom";
import Login from "../component/otherspage/Login";
import SignUp from "../component/otherspage/Signup";
import StudentDashboard from "../layout/StudentDashboard";
import Course from "../component/dashboard/studentDashboard/Course";
import Chatrooms from "../component/dashboard/studentDashboard/Chatrooms";
import Connect from "../component/dashboard/studentDashboard/Connect";
import Inbox from "../component/dashboard/studentDashboard/Inbox";
import Groups from "../component/dashboard/studentDashboard/Groups";
import Home from "../component/home/Home"

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
      element: <StudentDashboard />,
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
    }
  ])

  export default route