const express = require("express");
const multer = require("multer");
const { ObjectId } = require("mongodb");

// Multer memory storage (like your teammate)
const storage = multer.memoryStorage();
const upload = multer({ storage });

function AssignmentRoutes(app, db, gridFSBucket) {
  const assignmentsCollection = db.collection("assignments");
  const submissionsCollection = db.collection("assignmentSubmissions");

  // ✅ Create a new assignment with file (teacher)
app.post("/assignments", upload.single("file"), async (req, res) => {
  try {
    console.log("Incoming assignment upload request...");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { title, description, dueDate, courseId, section, teacherEmail } = req.body;
    const file = req.file;

    if (!title || !courseId || !section || !teacherEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let fileMeta = null;

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      const uploadStream = gridFSBucket.openUploadStream(filename, {
        contentType: file.mimetype,
      });

      uploadStream.end(file.buffer);

      const fileInfo = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () =>
          resolve({
            fileId: uploadStream.id,
            fileName: filename,
            contentType: file.mimetype,
            url: `http://localhost:5000/image/${uploadStream.id}`,
          })
        );
        uploadStream.on("error", reject);
      });

      fileMeta = fileInfo;
    }

    const assignment = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      courseId: new ObjectId(courseId),
      section,
      teacherEmail,
      createdAt: new Date(),
      ...(fileMeta && {
        fileId: fileMeta.fileId,
        fileName: fileMeta.fileName,
        contentType: fileMeta.contentType,
        fileUrl: fileMeta.url,
      }),
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
      if (courseId) query.courseId = new ObjectId(courseId);
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

  // 📤 Submit assignment with file upload (student)
  app.post("/assignment-submissions", upload.single("file"), async (req, res) => {
    try {
      const { assignmentId, courseId, section, studentEmail, studentName } = req.body;
      const file = req.file;

      if (!assignmentId || !courseId || !section || !studentEmail || !file) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Upload file to GridFS
      const filename = `${Date.now()}_${file.originalname}`;
      const uploadStream = gridFSBucket.openUploadStream(filename, {
        contentType: file.mimetype,
      });

      uploadStream.end(file.buffer);

      const fileInfo = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () =>
          resolve({
            filename: filename,
            fileId: uploadStream.id,
            contentType: file.mimetype,
            url: `http://localhost:5000/image/${uploadStream.id}`,
          })
        );
        uploadStream.on("error", reject);
      });

      const submission = {
        assignmentId: new ObjectId(assignmentId),
        courseId: new ObjectId(courseId),
        section,
        studentEmail,
        studentName,
        fileUrl: fileInfo.url,
        fileId: fileInfo.fileId,
        contentType: fileInfo.contentType,
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
      if (courseId) query.courseId = new ObjectId(courseId);
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
