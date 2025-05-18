const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: "CSE470",
  api_key: "291642634322429",
  api_secret: "a1-IwYjRmrse_zJcaLlzhEj0fwM",
});

// Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "assignments",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

function AssignmentRoutes(app, db) {
  const assignmentsCollection = db.collection("assignments");
  const submissionsCollection = db.collection("assignmentSubmissions");

  // ✅ Create a new assignment (teacher) with file upload
    app.post("/assignments", async (req, res) => {
  try {
    const { title, description, dueDate, courseId, section, teacherEmail } = req.body;

    if (!title || !courseId || !section || !teacherEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignment = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      courseId,
      section,
      teacherEmail,
      createdAt: new Date(),
    };

    const result = await assignmentsCollection.insertOne(assignment);
    res.status(201).json({ message: "Assignment created", id: result.insertedId });
  } catch (err) {
    console.error("Error creating assignment:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});



  // 🔍 Get assignments by courseId and section
  app.get("/assignments", async (req, res) => {
    try {
      const { courseId, section } = req.query;
      const query = {};
      if (courseId) query.courseId = courseId;
      if (section) query.section = section;

      const assignments = await assignmentsCollection.find(query).toArray();
      res.json(assignments);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ❌ Delete assignment by ID
  app.delete("/assignments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { ObjectId } = require("mongodb");

      const result = await assignmentsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (err) {
      console.error("Error deleting assignment:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // 📤 Submit assignment (student) with file upload
  app.post("/assignment-submissions", upload.single("file"), async (req, res) => {
    try {
      const { assignmentId, courseId, section, studentEmail, studentName } = req.body;

      if (!assignmentId || !courseId || !section || !studentEmail || !req.file) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const submission = {
        assignmentId,
        courseId,
        section,
        studentEmail,
        studentName,
        fileUrl: req.file.path, // Cloudinary file URL
        submittedAt: new Date(),
      };

      const result = await submissionsCollection.insertOne(submission);
      res.status(201).json({ message: "Submission successful", id: result.insertedId });
    } catch (err) {
      console.error("Error submitting assignment:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // 👀 Get assignment submissions (filter by course, section, or studentEmail)
  app.get("/assignment-submissions", async (req, res) => {
    try {
      const { courseId, section, studentEmail } = req.query;
      const query = {};
      if (courseId) query.courseId = courseId;
      if (section) query.section = section;
      if (studentEmail) query.studentEmail = studentEmail;

      const submissions = await submissionsCollection.find(query).toArray();
      res.json(submissions);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
}

module.exports = AssignmentRoutes;
