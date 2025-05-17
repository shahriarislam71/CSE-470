import axios from "axios";
import { useEffect, useState } from "react";

const CourseAssignments = ({ course }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    questions: "",
    dueDate: "",
    file: null,
    section: "",
  });

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/assignments/${course._id}`
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (course?._id) fetchAssignments();
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.questions || !form.dueDate || !form.file) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("questions", form.questions);
    formData.append("dueDate", form.dueDate);
    formData.append("section", form.section || "General");
    formData.append("file", form.file);
    formData.append("courseId", course._id);
    formData.append("courseName", course.courseName);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/assignments`,
        formData
      );
      setForm({ title: "", questions: "", dueDate: "", file: null, section: "" });
      fetchAssignments();
    } catch (err) {
      console.error("Error posting assignment", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/assignments/${id}`
      );
      fetchAssignments();
    } catch (err) {
      console.error("Error deleting assignment", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
        Manage Assignments for {course?.courseName}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-xl mb-10 border border-gray-200 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✍️ Post New Assignment
        </h2>

        <input
          type="text"
          placeholder="Assignment Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <textarea
          placeholder="Assignment Questions"
          value={form.questions}
          onChange={(e) => setForm({ ...form, questions: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Section (optional)"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          className="w-full"
          required
        />

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Upload Assignment
        </button>
      </form>

      {/* Assignment List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📝 Posted Assignments
        </h2>

        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p>No assignments posted yet.</p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-bold text-purple-700 mb-1">
                {assignment.title}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Due:</strong>{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Questions:</strong> {assignment.questions}
              </p>
              <a
                href={assignment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition mr-4"
              >
                📄 View Assignment
              </a>
              <button
                onClick={() => handleDelete(assignment._id)}
                className="inline-block bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                ❌ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseAssignments;
