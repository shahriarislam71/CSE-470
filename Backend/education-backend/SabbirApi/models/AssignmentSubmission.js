const { ObjectId } = require("mongodb");

const assignmentSubmissionSchema = {
  assignmentId: ObjectId,
  studentEmail: String,
  studentName: String, // Optional but useful
  courseId: ObjectId,
  section: String,
  submittedAt: { type: Date, default: new Date() },
  fileId: ObjectId,         // Reference to GridFS
  fileUrl: String,          // Download URL (e.g. /image/:id)
  contentType: String       // For serving/download
};

module.exports = assignmentSubmissionSchema;
