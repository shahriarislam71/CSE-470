import { createBrowserRouter } from "react-router-dom";
import Login from "../component/otherspage/Login";
import Signup from "../component/otherspage/Signup";
import Home from "../component/home/Home";

const route = createBrowserRouter([
    {
        path: '/',
        element: <Home></Home>,
        children: [
            {
                path: '/',
                element: <Home></Home>,
                // loader: () => fetch("https://food-recipe-server-site-project-eowf2e9f8.vercel.app/data")

            },
            
        ]
    },
    {
        path: 'login',
        element: <Login></Login>
    },
    {
        path: "signup",
        element: <Signup></Signup>
    }
])
export default route;