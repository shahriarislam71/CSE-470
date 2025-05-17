const { ObjectId } = require("mongodb");

const assignmentSubmissionSchema = {
  assignmentId: ObjectId,
  studentEmail: String,
  courseId: ObjectId,
  section: String,
  submittedAt: { type: Date, default: new Date() },
  content: String, // Could be text, file URL, or other input
};

module.exports = assignmentSubmissionSchema;
