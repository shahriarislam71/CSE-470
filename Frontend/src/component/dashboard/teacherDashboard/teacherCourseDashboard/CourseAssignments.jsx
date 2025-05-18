import axios from "axios";
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

    const payload = {
      title: form.title,
      description: form.questions,
      dueDate: form.dueDate,
      courseId,
      section: sectionName,
      teacherEmail: "demo@bracu.edu.bd", // replace with dynamic value if needed
    };

    try {
      await axios.post(`${BASE_URL}/assignments`, payload);
      setForm({ title: "", questions: "", dueDate: "" });
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
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
        Manage Assignments for {course?.courseName || courseId} ({sectionName})
      </h1>

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

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Create Assignment
        </button>
      </form>

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
                {assignment.dueDate
                  ? new Date(assignment.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Questions:</strong> {assignment.description}
              </p>
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
