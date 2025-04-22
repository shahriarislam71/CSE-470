import { useOutletContext } from "react-router-dom";

const Materials = () => {
    const { course } = useOutletContext();
    console.log(course)
    if (!course) return <h1 className="text-white">Loading Course Materials...</h1>;

    return (
        <div className="w-full p-4">
            <h1 className="text-3xl text-center font-bold text-[#A855F7]">{course.courseName} - Materials</h1>
            <div className="mt-8">
                {course.weeks.map((week, i) => (
                    <div key={i} className="mb-6">
                        <h2 className="text-2xl font-semibold text-[#A855F7]">Week {week.week}</h2>
                        <ul className="mt-2">
                            {week.materials.map((material, j) => (
                                <li key={j} className="bg-[#012d5b] p-3 rounded-md text-white mt-2">
                                    <strong>{material.title}</strong>
                                    {material.dueDate && (
                                        <p className="text-sm">Due: {new Date(material.dueDate).toLocaleString()}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Materials;
