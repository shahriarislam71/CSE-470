import { useEffect, useState, useContext } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import {
    FaArchive,
    FaArrowLeft,
    FaBook,
    FaRegFileAlt,
    FaRegFileVideo,
    FaUserGraduate,
    FaEdit,
} from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import {
    MdAnnouncement,
    MdOutlineAssignment,
    MdOutlineUnsubscribe,
} from "react-icons/md";
import {
    Link,
    NavLink,
    Outlet,
    useLocation,
    useParams,
} from "react-router-dom";
import { Authcontext } from "../context/AuthProvider";

const EnrolledCourseSideBar = () => {
    const { courseTitle } = useParams();
    const location = useLocation();
    const [course, setCourse] = useState(null);
    const { users } = useContext(Authcontext);
    const isInstructor =
        users?.role === "instructor" ||
        users?.email === "instructor@example.com";

    useEffect(() => {
        fetch("/enrolledcourse.json")
            .then((response) => response.json())
            .then((data) => {
                const selectedCourse = data.find(
                    (c) => c.courseTitle === courseTitle
                );
                setCourse(selectedCourse);
            })
            .catch((error) =>
                console.error("Error fetching course data:", error)
            );
    }, [courseTitle]);

    // Function to check if any section inside a title is active
    const isActiveSection = (paths) =>
        paths.some((path) => location.pathname.includes(path));

    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col items-center justify-center">
                    <Outlet context={{ course }} />
                    <label
                        htmlFor="my-drawer-2"
                        className="btn btn-primary drawer-button lg:hidden"
                    >
                        Open drawer
                    </label>
                </div>

                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-2"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="background rounded-lg menu sidebar text-base-content min-h-full w-80 p-4">
                        <Link title="Back to Student Dashboard" to={"/home"}>
                            <FaArrowLeft className="w-10 h-10 p-2 border-2 rounded-full mb-4"></FaArrowLeft>
                        </Link>
                        {/* Course Materials */}
                        <div>
                            <p
                                className={
                                    isActiveSection([
                                        "course-outline",
                                        "assignments",
                                        "videos",
                                        "practiceproblem",
                                        "studentresources",
                                        "lecturenotes",
                                        "other-resources",
                                        "manage-resources",
                                    ])
                                        ? "font-bold bg-[#012d5b] text-white px-4 py-2 mt-8 rounded-lg"
                                        : "text-xl mt-2"
                                }
                            >
                                Course Materials
                            </p>
                            <div>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/course-outline`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <FaRegFileAlt /> Course Outline
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/assignments`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <MdOutlineAssignment /> Assignments
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/videos`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <FaRegFileVideo /> Videos
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/practiceproblem`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <BsFileEarmarkText /> Practice Sheets
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/studentresources`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <FaUserGraduate /> Students Uploaded
                                        Resources
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/lecturenotes`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <FaBook /> Lecture Notes
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/other-resources`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <FaBook /> Supplemental Resources
                                    </NavLink>
                                </li>
                                {isInstructor && (
                                    <li>
                                        <NavLink
                                            to={`/enrolledCourses/${courseTitle}/manage-resources`}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "font-semibold text-xl text-white flex items-center gap-2"
                                                    : "flex items-center gap-2 text-lg"
                                            }
                                        >
                                            <FaEdit /> Manage Resources
                                        </NavLink>
                                    </li>
                                )}
                            </div>
                        </div>

                        {/* Communications */}
                        <div>
                            <p
                                className={
                                    isActiveSection([
                                        "announcement",
                                        "chatroom",
                                    ])
                                        ? "font-bold bg-[#012d5b] text-white px-4 py-2 mt-8 rounded-lg"
                                        : "text-xl mt-8"
                                }
                            >
                                Communications
                            </p>
                            <div>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/announcement`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <MdAnnouncement /> Announcement
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/chatroom`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <IoChatbubblesOutline /> ChatRooms
                                    </NavLink>
                                </li>
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <p
                                className={
                                    isActiveSection(["archive", "unenroll"])
                                        ? "font-bold bg-[#012d5b] text-white px-4 py-2 mt-8 rounded-lg"
                                        : "text-xl mt-8"
                                }
                            >
                                Actions
                            </p>
                            <div>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/archive`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <FaArchive /> Archive
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/enrolledCourses/${courseTitle}/unenroll`}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-xl text-white flex items-center gap-2"
                                                : "flex items-center gap-2 text-lg"
                                        }
                                    >
                                        <MdOutlineUnsubscribe /> Unenroll
                                    </NavLink>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCourseSideBar;
