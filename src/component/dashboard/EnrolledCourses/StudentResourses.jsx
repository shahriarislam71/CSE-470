import { useState } from "react";
import { FaFileAlt, FaFolder, FaPlus } from "react-icons/fa";

const StudentResources = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [currentPath, setCurrentPath] = useState(["Root"]);
    const [folders, setFolders] = useState({});
    const [files, setFiles] = useState({});

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    // Navigate into a folder
    const openFolder = (folderName) => {
        setCurrentPath([...currentPath, folderName]);
    };

    // Go back to the previous folder
    const goBack = () => {
        if (currentPath.length > 1) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    // Create Folder
    const handleCreateFolder = (e) => {
        e.preventDefault();
        const folderName = e.target.folderName.value.trim();
        if (!folderName) return;

        const pathKey = currentPath.join("/");
        setFolders((prev) => ({
            ...prev,
            [pathKey]: [...(prev[pathKey] || []), folderName],
        }));

        setCreatingFolder(false);
        setDrawerOpen(false);
    };

    // Upload File
    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files).map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type.startsWith("image/") ? "image" : "file",
        }));

        const pathKey = currentPath.join("/");
        setFiles((prev) => ({
            ...prev,
            [pathKey]: [...(prev[pathKey] || []), ...uploadedFiles],
        }));

        setDrawerOpen(false);
    };

    // Get current folder content
    const pathKey = currentPath.join("/");
    const currentFolders = folders[pathKey] || [];
    const currentFiles = files[pathKey] || [];

    return (
        <div className="w-full h-full pl-4">
            <div className="w-full mx-auto mt-2 p-4 border rounded-lg bg-[#012d5b] shadow-md">
                {/* Header (Fixed) */}
                <div className="sticky top-0 bg-white p-4 z-10 flex justify-between items-center border-b shadow-md">
                    <h2 className="text-xl font-semibold text-[#8B5CF7]">Upload File</h2>
                    <button
                        className="bg-[#8B5CF6] text-white p-2 rounded-full shadow-md hover:bg-[#8B5CF7]"
                        onClick={toggleDrawer}
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Breadcrumb Navigation */}
                <div className="p-3 text-white">
                    <button onClick={goBack} className="text-[#8B5CF7] mr-2">⬅ Back</button>
                    {currentPath.join(" / ")}
                </div>

                {/* Drawer for Upload/Create */}
                {drawerOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-lg font-semibold mb-4 text-[#8B5CF6]">Choose an option</h3>
                            <button
                                className="w-full bg-white p-2 rounded mb-2 border-2 border-[#8B5CF6] text-[#012d5b]"
                                onClick={() => setCreatingFolder(true)}
                            >
                                📁 Create Folder
                            </button>
                            <input
                                type="file"
                                multiple
                                className="w-full p-2 border-2 border-[#8B5CF6] rounded text-[#012d5b]"
                                onChange={handleFileUpload}
                            />
                            <button
                                className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                onClick={toggleDrawer}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Folder Creation Form */}
                {creatingFolder && (
                    <form onSubmit={handleCreateFolder} className="p-4 border rounded bg-white mb-4">
                        <input
                            type="text"
                            name="folderName"
                            placeholder="Enter folder name"
                            className="w-full p-2 border-2 border-[#8B5CF6] placeholder-[#012d5b] rounded bg-white text-[#012d5b]"
                            required
                        />
                        <button type="submit" className="w-full bg-[#8B5CF6] text-white py-2 mt-2 rounded hover:bg-[#8B5CF7]">
                            Create Folder
                        </button>
                    </form>
                )}

                {/* Folder Section (Above Files) */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {currentFolders.map((folder, index) => (
                        <div
                            key={index}
                            className="p-3 border rounded-lg shadow-sm bg-white flex flex-col items-center cursor-pointer hover:bg-gray-200"
                            onClick={() => openFolder(folder)}
                        >
                            <FaFolder className="text-yellow-500 text-4xl" />
                            <p className="text-medium text-[#012d5b] mt-2 text-center truncate w-24">{folder}</p>
                        </div>
                    ))}
                </div>

                {/* File Section */}
                <div className="grid grid-cols-4 gap-4">
                    {currentFiles.map((file, index) => (
                        <div
                            key={index}
                            className="p-3 border rounded-lg shadow-sm bg-white flex flex-col items-center cursor-pointer hover:bg-gray-200"
                        >
                            {file.type === "image" ? (
                                <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                            ) : (
                                <FaFileAlt className="text-[#012d5b] text-3xl" />
                            )}
                            <p className="text-medium mt-2 text-center text-[#012d5b] truncate w-24">{file.name}</p>
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8B5CF7] text-medium mt-1"
                            >
                                Open
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentResources;