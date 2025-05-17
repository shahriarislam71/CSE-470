const { ObjectId } = require("mongodb");

const assignmentSchema = {
  title: String,
  description: String,
  dueDate: Date,
  instructorEmail: String,
  courseId: ObjectId,
  section: String,
  createdAt: { type: Date, default: new Date() }
};

module.exports = assignmentSchema;
