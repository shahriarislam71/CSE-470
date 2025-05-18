import axios from "axios";
import { FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseAssignments = () => {
  const { courseId, sectionName } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    questions: "",
    dueDate: "",
  });
  const [file, setFile] = useState(null);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to fetch course details", err);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/assignments?courseId=${courseId}&section=${sectionName}`
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId && sectionName) fetchAssignments();
  }, [courseId, sectionName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.questions || !form.dueDate) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.questions);
    formData.append("dueDate", form.dueDate);
    formData.append("courseId", courseId);
    formData.append("section", sectionName);
    formData.append("teacherEmail", "demo@bracu.edu.bd"); // Replace dynamically
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post(`${BASE_URL}/assignments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ title: "", questions: "", dueDate: "" });
      setFile(null);
      fetchAssignments();
    } catch (err) {
      console.error("Error posting assignment", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      console.error("Error deleting assignment", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Manage Assignments for (Section-{sectionName})
      </h1>

      {/* Assignment Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-10 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✍️ Create New Assignment
        </h2>

        <input
          type="text"
          placeholder="Assignment Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-purple-500"
          required
        />

        <textarea
          placeholder="Assignment Questions"
          value={form.questions}
          onChange={(e) => setForm({ ...form, questions: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-purple-500"
          required
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-purple-500"
          required
        />

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Attachment (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Upload Assignment
        </button>
      </form>

      {/* Posted Assignments */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📝 Posted Assignments
        </h2>

        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-600">No assignments posted yet.</p>
        ) : (
          <div className="space-y-5">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="p-5 bg-white border border-gray-200 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-purple-700">
                    📘 {assignment.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Due:</strong>{" "}
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Questions:</strong> {assignment.description}
                  </p>

                  {assignment.fileUrl && (
                    <a
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm inline-flex items-center gap-1 mt-2 hover:underline"
                    >
                      <FileText size={16} />
                      Preview Attachment
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(assignment._id)}
                  className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition inline-flex items-center"
                >
                  <Trash2 className="mr-1" size={16} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseAssignments;
