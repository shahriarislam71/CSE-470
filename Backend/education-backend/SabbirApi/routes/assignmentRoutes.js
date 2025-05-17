const express = require("express");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const storage = require("../../utils/cloudinaryStorage");
const upload = multer({ storage });

const router = express.Router();

module.exports = (db) => {
  const assignmentsCollection = db.collection("assignments");
  const submissionsCollection = db.collection("assignmentSubmissions");

  // Create an assignment (teacher)
  router.post("/", async (req, res) => {
    try {
      const { title, description, dueDate, instructorEmail, courseId, section } = req.body;
      if (!title || !dueDate || !instructorEmail || !courseId || !section) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newAssignment = {
        title,
        description,
        dueDate: new Date(dueDate),
        instructorEmail,
        courseId: new ObjectId(courseId),
        section,
        createdAt: new Date(),
      };

      const result = await assignmentsCollection.insertOne(newAssignment);
      res.status(201).json({
        message: "Assignment created",
        assignment: result.ops?.[0] || newAssignment,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get assignments for a course + section
  router.get("/", async (req, res) => {
    try {
      const { courseId, section } = req.query;
      if (!courseId || !section) {
        return res.status(400).json({ message: "Missing courseId or section" });
      }

      const assignments = await assignmentsCollection
        .find({ courseId: new ObjectId(courseId), section })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(assignments);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Submit assignment (student) with file upload to Cloudinary
  router.post("/submit", upload.single("file"), async (req, res) => {
    try {
      const { assignmentId, studentEmail, courseId, section } = req.body;

      if (!assignmentId || !studentEmail || !courseId || !section || !req.file) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const submission = {
        assignmentId: new ObjectId(assignmentId),
        studentEmail,
        courseId: new ObjectId(courseId),
        section,
        fileUrl: req.file.path,
        fileType: req.file.mimetype,
        submittedAt: new Date(),
      };

      await submissionsCollection.insertOne(submission);
      res.status(201).json({ message: "Submission successful", submission });
    } catch (err) {
      console.error("Submission error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get submissions by student
  router.get("/submissions", async (req, res) => {
    try {
      const { studentEmail, courseId, section } = req.query;
      if (!studentEmail || !courseId || !section) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const submissions = await submissionsCollection
        .find({
          studentEmail,
          courseId: new ObjectId(courseId),
          section,
        })
        .toArray();

      res.json(submissions);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
