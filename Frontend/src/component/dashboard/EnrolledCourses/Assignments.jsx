import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const StudentAssignments = () => {
  const { course } = useOutletContext() || {};
  const { courseId, sectionName } = useParams(); // expects /courses/:courseId/:sectionName

  const [assignments, setAssignments] = useState([]);
  const [uploading, setUploading] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/assignments?courseId=${courseId}&section=${sectionName}`
        );
        setAssignments(res.data || []);
      } catch (err) {
        console.error("Failed to load assignments", err);
      }
    };

    if (courseId && sectionName) fetchAssignments();
  }, [courseId, sectionName]);

  const handleFileChange = (e, assignmentId) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [assignmentId]: e.target.files[0],
    }));
  };

  const handleUpload = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("courseId", courseId);
    formData.append("section", sectionName);
    formData.append("studentEmail", "student@bracu.edu.bd"); // Replace with real auth value
    formData.append("file", file);

    try {
      setUploading((prev) => ({ ...prev, [assignmentId]: true }));
      await axios.post(`${BASE_URL}/assignment-submissions`, formData);
      alert("Submission uploaded successfully!");
    } catch (err) {
      console.error("Submission failed", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-10">
        Assignments for {course?.courseName || courseId}
      </h1>

      {assignments.length === 0 ? (
        <p className="text-center text-gray-500">No assignments found.</p>
      ) : (
        assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-2">
              {assignment.title}
            </h3>
            <p className="text-gray-700 mb-1">
              <strong>Questions:</strong> {assignment.description}
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Due Date:</strong>{" "}
              {assignment.dueDate
                ? new Date(assignment.dueDate).toLocaleString()
                : "N/A"}
            </p>

            {assignment.fileUrl && (
              <a
                href={assignment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition mb-4"
              >
                📄 Download Assignment
              </a>
            )}

            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <label
                htmlFor={`upload-${assignment._id}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload your solution:
              </label>

              <input
                id={`upload-${assignment._id}`}
                type="file"
                onChange={(e) => handleFileChange(e, assignment._id)}
                className="mb-2"
              />

              <button
                onClick={() => handleUpload(assignment._id)}
                disabled={uploading[assignment._id]}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                {uploading[assignment._id] ? "Uploading..." : "Submit Assignment"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentAssignments;
