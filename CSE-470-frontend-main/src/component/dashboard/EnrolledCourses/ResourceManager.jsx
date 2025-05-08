import { useState, useEffect, useContext } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaTrash,
    FaEdit,
    FaSave,
    FaUndo,
    FaFile,
    FaBook,
    FaVideo,
    FaTools,
    FaUserCircle,
} from "react-icons/fa";
import {
    HiCode,
    HiDocumentText,
    HiAcademicCap,
    HiDatabase,
    HiInformationCircle,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { Authcontext } from "../../../context/AuthProvider";

const ResourceManager = () => {
    const { course } = useOutletContext() || {};
    const { courseTitle } = useParams();
    const navigate = useNavigate();
    const { users } = useContext(Authcontext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "book",
        description: "",
        link: "",
        imageUrl: "",
        author: "",
        creator: "",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        readTime: "",
        contributorName: users?.displayName || users?.name || "Anonymous",
        contributorRole: users?.role || "student",
        contributorEmail: users?.email || "",
    });

    const isInstructor =
        users?.role === "instructor" ||
        users?.email === "instructor@example.com";
    const isDCO = users?.role === "dco" || users?.email === "dco@example.com";

    // Check if user can edit/delete resources (only instructors and DCOs can edit/delete any resource)
    const canManageAnyResource = isInstructor || isDCO;

    const resourceTypes = [
        {
            type: "book",
            label: "Book",
            icon: <FaBook className="text-blue-600" />,
        },
        {
            type: "video",
            label: "Video",
            icon: <FaVideo className="text-red-600" />,
        },
        {
            type: "tool",
            label: "Tool",
            icon: <FaTools className="text-green-600" />,
        },
        {
            type: "article",
            label: "Article",
            icon: <HiDocumentText className="text-yellow-600" />,
        },
        {
            type: "documentation",
            label: "Documentation",
            icon: <HiCode className="text-purple-600" />,
        },
        {
            type: "course",
            label: "Course",
            icon: <HiAcademicCap className="text-indigo-600" />,
        },
        {
            type: "dataset",
            label: "Dataset",
            icon: <HiDatabase className="text-pink-600" />,
        },
        {
            type: "cheatsheet",
            label: "Cheatsheet",
            icon: <FaFile className="text-orange-600" />,
        },
        {
            type: "practice",
            label: "Practice Project",
            icon: <FaFile className="text-cyan-600" />,
        },
        {
            type: "community",
            label: "Community",
            icon: <HiInformationCircle className="text-teal-600" />,
        },
    ];

    useEffect(() => {
        if (course && course.otherResources) {
            setResources(course.otherResources);
            setLoading(false);
        }
    }, [course]);

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Check if current user can edit a specific resource
    const canEditResource = (resource) => {
        if (canManageAnyResource) return true;
        return resource.contributorEmail === users?.email;
    };

    // Filter resources by search term
    const filteredResources = () => {
        if (!searchTerm) return resources;

        return resources.filter(
            (resource) =>
                resource.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                resource.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (resource.author &&
                    resource.author
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (resource.creator &&
                    resource.creator
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (resource.contributorName &&
                    resource.contributorName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        );
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddNew = () => {
        setEditingResource(null);
        setFormData({
            title: "",
            type: "book",
            description: "",
            link: "",
            imageUrl: "",
            author: "",
            creator: "",
            date: new Date().toISOString().split("T")[0],
            duration: "",
            readTime: "",
            contributorName: users?.displayName || users?.name || "Anonymous",
            contributorRole: users?.role || "student",
            contributorEmail: users?.email || "",
        });
        setShowForm(true);
    };

    const handleEdit = (resource) => {
        // Check if user has permission to edit this resource
        if (!canEditResource(resource)) {
            Swal.fire({
                title: "Permission Denied",
                text: "You can only edit resources that you contributed",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setEditingResource(resource);
        setFormData({
            title: resource.title,
            type: resource.type,
            description: resource.description,
            link: resource.link,
            imageUrl: resource.imageUrl || "",
            author: resource.author || "",
            creator: resource.creator || "",
            date: resource.date,
            duration: resource.duration || "",
            readTime: resource.readTime || "",
            contributorName:
                resource.contributorName ||
                users?.displayName ||
                users?.name ||
                "Anonymous",
            contributorRole:
                resource.contributorRole || users?.role || "student",
            contributorEmail: resource.contributorEmail || users?.email || "",
        });
        setShowForm(true);
    };

    const handleDelete = (resourceId) => {
        const resourceToDelete = resources.find((r) => r.id === resourceId);

        // Check if user has permission to delete this resource
        if (!canEditResource(resourceToDelete)) {
            Swal.fire({
                title: "Permission Denied",
                text: "You can only delete resources that you contributed",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This resource will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // In a real application, you would send a delete request to your backend
                // For now, we'll update the local state
                const updatedResources = resources.filter(
                    (r) => r.id !== resourceId
                );
                setResources(updatedResources);

                Swal.fire(
                    "Deleted!",
                    "The resource has been deleted.",
                    "success"
                );
            }
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingResource(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title || !formData.description || !formData.link) {
            Swal.fire({
                title: "Error",
                text: "Please fill in all required fields",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        // In a real application, you would send this to your backend
        // For now, we'll update the local state
        if (editingResource) {
            // Update existing resource
            const updatedResources = resources.map((r) =>
                r.id === editingResource.id ? { ...formData, id: r.id } : r
            );
            setResources(updatedResources);
            Swal.fire(
                "Updated!",
                "Resource has been updated successfully.",
                "success"
            );
        } else {
            // Add new resource
            const newResource = {
                ...formData,
                id: Date.now(), // Simple ID generation
            };
            setResources([...resources, newResource]);
            Swal.fire(
                "Added!",
                "New resource has been added successfully.",
                "success"
            );
        }

        setShowForm(false);
        setEditingResource(null);
    };

    // Get icon for resource type
    const getResourceIcon = (type) => {
        const resourceType = resourceTypes.find((rt) => rt.type === type);
        return resourceType ? resourceType.icon : <FaFile />;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-color">
                        Contribute Resources
                    </h1>
                    <button
                        onClick={() =>
                            navigate(
                                `/enrolledCourses/${courseTitle}/other-resources`
                            )
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                    >
                        View All Resources
                    </button>
                </div>

                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">
                        About This Feature
                    </h2>
                    <p className="text-blue-700">
                        This feature allows students, instructors, and
                        department coordination officers (DCOs) to contribute
                        supplemental learning resources that may help others in
                        the course. Share books, videos, tools, or any other
                        resource that you&quot;ve found helpful!
                    </p>
                </div>

                {!showForm ? (
                    <>
                        {/* Search and Add New */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                            <div className="relative flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    className="w-full px-4 py-2 pl-10 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            </div>
                            <button
                                onClick={handleAddNew}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                                <FaPlus /> Add New Resource
                            </button>
                        </div>

                        {/* Resources Table */}
                        {filteredResources().length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Author/Creator
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contributed By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date Added
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredResources().map((resource) => (
                                            <tr
                                                key={resource.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getResourceIcon(
                                                            resource.type
                                                        )}
                                                        <span className="capitalize">
                                                            {resource.type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {resource.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">
                                                        {resource.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {resource.author ||
                                                        resource.creator ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <FaUserCircle
                                                            className={`${
                                                                resource.contributorRole ===
                                                                "instructor"
                                                                    ? "text-purple-600"
                                                                    : resource.contributorRole ===
                                                                      "dco"
                                                                    ? "text-blue-600"
                                                                    : "text-green-600"
                                                            }`}
                                                        />
                                                        <span>
                                                            {resource.contributorName ||
                                                                "Anonymous"}
                                                        </span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                                                            {resource.contributorRole ||
                                                                "student"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(resource.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {canEditResource(
                                                        resource
                                                    ) && (
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        resource
                                                                    )
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        resource.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-xl text-gray-500">
                                    No resources found
                                </p>
                                {searchTerm && (
                                    <p className="mt-2 text-gray-400">
                                        Try changing your search term
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingResource
                                ? "Edit Resource"
                                : "Add New Resource"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title*
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resource Type*
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        {resourceTypes.map((type) => (
                                            <option
                                                key={type.type}
                                                value={type.type}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link URL*
                                    </label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Creator
                                    </label>
                                    <input
                                        type="text"
                                        name="creator"
                                        value={formData.creator}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date*
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2h 30m, 5 days"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Read Time
                                    </label>
                                    <input
                                        type="text"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 15 min"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description*
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                                >
                                    <FaUndo /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                                >
                                    <FaSave />{" "}
                                    {editingResource ? "Update" : "Save"}{" "}
                                    Resource
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceManager;
