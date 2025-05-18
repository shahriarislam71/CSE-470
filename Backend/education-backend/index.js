const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  GridFSBucket,
} = require("mongodb");
const multer = require("multer");
const path = require("path");

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xq01pu7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Initialize GridFS
let gfs;
let gridFSBucket;

client.connect().then(() => {
  const db = client.db("education");
  gridFSBucket = new GridFSBucket(db, {
    bucketName: "images",
  });
  gfs = db.collection("images.files");
});

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function run() {
  try {
    await client.connect();

    // Initialize collections
    const db = client.db("education");
    
    // Import your assignment routes and pass app + db
    // ✅ Pass gridFSBucket into your route
    const AssignmentRoutes = require("./SabbirApi/routes/assignmentRoutes");
    AssignmentRoutes(app, db, gridFSBucket);

    const usersCollection = db.collection("users");
    const teachersCollection = db.collection("teachers");
    const studentsCollection = db.collection("students");
    const coursesCollection = db.collection("courses"); // New collection for courses
    const sectionsCollection = db.collection("sections");
    const sectionStudentsCollection = db.collection("sectionStudents");
    const chatroomsCollection = db.collection("chatrooms");
    const courseVideosCollection = db.collection("courseVideos");
    const lectureNotesCollection = db.collection("lectureNotes");
    const enrolledCoursesCollection = db.collection("enrolledCourses");

    

    // Mount assignment routes after db is available
    // const assignmentRoutes = require("./SabbirApi/routes/assignmentRoutes");
    // app.use("/api/assignments", assignmentRoutes(db));

    // Image Upload Endpoint
    app.post("/upload", upload.single("image"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const filename = `${Date.now()}_${req.file.originalname}`;
        const uploadStream = gridFSBucket.openUploadStream(filename, {
          contentType: req.file.mimetype,
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on("finish", () => {
          const imageUrl = `http://localhost:5000/image/${uploadStream.id}`;
          res.status(201).json({
            message: "Image uploaded successfully",
            imageUrl,
          });
        });

        uploadStream.on("error", (error) => {
          console.error("Error uploading image:", error);
          res.status(500).json({ message: "Error uploading image" });
        });
      } catch (err) {
        console.error("Error in image upload:", err);
        res.status(500).json({ message: "Server error while uploading image" });
      }
    });

    // Image Retrieval Endpoint
    app.get("/image/:id", async (req, res) => {
      try {
        const fileId = new ObjectId(req.params.id);
        const file = await gfs.findOne({ _id: fileId });

        if (!file) {
          return res.status(404).json({ message: "Image not found" });
        }

        const downloadStream = gridFSBucket.openDownloadStream(fileId);
        res.set("Content-Type", file.contentType);
        downloadStream.pipe(res);
      } catch (err) {
        console.error("Error retrieving image:", err);
        res.status(500).json({ message: "Error retrieving image" });
      }
    });

    // Lecture Notes Endpoints
    app.post("/lecture-notes", upload.single("file"), async (req, res) => {
      try {
        const { courseCode, email, week, title, description } = req.body;
        const file = req.file;

        if (!courseCode || !email || !week || !file) {
          return res
            .status(400)
            .json({ message: "Required fields are missing" });
        }

        // Upload file to GridFS
        const filename = `${Date.now()}_${file.originalname}`;
        const uploadStream = gridFSBucket.openUploadStream(filename, {
          contentType: file.mimetype,
        });

        uploadStream.end(file.buffer);

        // Wait for upload to finish
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

        // Find or create lecture notes document
        const result = await lectureNotesCollection.findOneAndUpdate(
          { courseCode, email },
          {
            $setOnInsert: {
              courseCode,
              email,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            $push: {
              notes: {
                week: parseInt(week),
                title,
                description,
                fileUrl: fileInfo.url,
                fileId: fileInfo.fileId,
                uploadedAt: new Date(),
                contentType: fileInfo.contentType,
              },
            },
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );

        res.status(201).json({
          message: "Lecture note uploaded successfully",
          lectureNote: result.value,
        });
      } catch (err) {
        console.error("Error uploading lecture note:", err);
        res
          .status(500)
          .json({ message: "Server error while uploading lecture note" });
      }
    });

    // Create Course Endpoint
    app.post("/courses", async (req, res) => {
      try {
        const {
          courseName,
          courseCode,
          facultyInitial,
          description,
          imageUrl,
          email,
        } = req.body;

        // Basic validation
        if (!courseName || !courseCode || !facultyInitial) {
          return res
            .status(400)
            .json({ message: "Required fields are missing" });
        }

        const newCourse = {
          courseName,
          courseCode,
          facultyInitial,
          description,
          imageUrl,
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "active",
        };

        const result = await coursesCollection.insertOne(newCourse);

        res.status(201).json({
          message: "Course created successfully",
          course: {
            id: result.insertedId,
            ...newCourse,
          },
        });
      } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Server error while creating course" });
      }
    });

    // Get all courses
    app.get("/courses", async (req, res) => {
      try {
        const courses = await coursesCollection.find().toArray();
        res.json(courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching courses" });
      }
    });

    // Get courses by user email
    app.get("/courses/created-by-user", async (req, res) => {
      try {
        const { email } = req.query;

        if (!email) {
          return res
            .status(400)
            .json({ message: "Email parameter is required" });
        }

        const courses = await coursesCollection
          .find({ email })
          .sort({ createdAt: -1 })
          .toArray();

        res.json(courses);
      } catch (err) {
        console.error("Error fetching user courses:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching user courses" });
      }
    });

    // Delete course endpoint
    app.delete("/courses/:id", async (req, res) => {
      try {
        const { id } = req.params;

        // First delete the associated image from GridFS if it exists
        const course = await coursesCollection.findOne({
          _id: new ObjectId(id),
        });
        if (course && course.imageUrl) {
          const imageId = course.imageUrl.split("/").pop();
          await gridFSBucket.delete(new ObjectId(imageId));
        }

        // Then delete the course
        const result = await coursesCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
      } catch (err) {
        console.error("Error deleting course:", err);
        res.status(500).json({ message: "Server error while deleting course" });
      }
    });

    // update the name and other details of the course
    app.put("/courses/:id", upload.single("image"), async (req, res) => {
      try {
        const { id } = req.params;
        const {
          courseName,
          courseCode,
          facultyInitial,
          description,
          currentImageUrl,
        } = req.body;

        // Basic validation
        if (!courseName || !courseCode || !facultyInitial) {
          return res
            .status(400)
            .json({ message: "Required fields are missing" });
        }

        let imageUrl = currentImageUrl;

        // Handle new image upload if provided
        if (req.file) {
          // Delete old image if it exists
          if (currentImageUrl) {
            const oldImageId = currentImageUrl.split("/").pop();
            await gridFSBucket.delete(new ObjectId(oldImageId));
          }

          // Upload new image
          const filename = `${Date.now()}_${req.file.originalname}`;
          const uploadStream = gridFSBucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
          });

          uploadStream.end(req.file.buffer);

          // Wait for upload to finish
          await new Promise((resolve, reject) => {
            uploadStream.on("finish", resolve);
            uploadStream.on("error", reject);
          });

          imageUrl = `/api/image/${uploadStream.id}`;
        }

        const updatedCourse = {
          courseName,
          courseCode,
          facultyInitial,
          description,
          imageUrl,
          updatedAt: new Date(),
        };

        const result = await coursesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedCourse }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Course not found" });
        }

        res.json({
          message: "Course updated successfully",
          course: {
            ...updatedCourse,
            _id: id,
          },
        });
      } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).json({ message: "Server error while updating course" });
      }
    });

    // get the single course
    // Get single course by ID
    app.get("/courses/:id", async (req, res) => {
      try {
        const { id } = req.params;

        // Validate the ID format first
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid course ID format" });
        }

        const course = await coursesCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
      } catch (err) {
        console.error("Error fetching course:", err);
        res.status(500).json({ message: "Server error while fetching course" });
      }
    });
    // Teacher Routes (existing)
    app.post("/teachers", async (req, res) => {
      try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res
            .status(400)
            .json({ message: "Please provide a valid email address" });
        }

        const existingTeacher = await teachersCollection.findOne({ email });
        if (existingTeacher) {
          return res.status(400).json({ message: "Teacher already exists" });
        }

        const newTeacher = {
          email,
          createdAt: new Date(),
          status: "pending",
        };

        const result = await teachersCollection.insertOne(newTeacher);

        res.status(201).json({
          message: "Teacher added successfully",
          teacher: {
            id: result.insertedId,
            email: newTeacher.email,
            status: newTeacher.status,
            createdAt: newTeacher.createdAt,
          },
        });
      } catch (err) {
        console.error("Error adding teacher:", err);
        if (err.code === 11000) {
          return res
            .status(400)
            .json({ message: "Teacher with this email already exists" });
        }
        res.status(500).json({ message: "Server error while adding teacher" });
      }
    });

    // Student Routes (new)
    app.post("/students", async (req, res) => {
      try {
        const { email } = req.body;

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res
            .status(400)
            .json({ message: "Please provide a valid email address" });
        }

        // Check if student exists
        const existingStudent = await studentsCollection.findOne({ email });
        if (existingStudent) {
          return res.status(400).json({ message: "Student already exists" });
        }

        // Create new student
        const newStudent = {
          email,
          role: "student",
          createdAt: new Date(),
          status: "active", // Students are active by default
        };

        const result = await studentsCollection.insertOne(newStudent);

        res.status(201).json({
          message: "Student added successfully",
          student: {
            id: result.insertedId,
            email: newStudent.email,
            role: newStudent.role,
            status: newStudent.status,
            createdAt: newStudent.createdAt,
          },
        });
      } catch (err) {
        console.error("Error adding student:", err);
        if (err.code === 11000) {
          return res
            .status(400)
            .json({ message: "Student with this email already exists" });
        }
        res.status(500).json({ message: "Server error while adding student" });
      }
    });

    // Get all students
    app.get("/students", async (req, res) => {
      try {
        const students = await studentsCollection.find().toArray();
        res.json(students);
      } catch (err) {
        console.error("Error fetching students:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching students" });
      }
    });

    // Get all teachers (existing)
    app.get("/teachers", async (req, res) => {
      try {
        const teachers = await teachersCollection.find().toArray();
        res.json(teachers);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching teachers" });
      }
    });

    // Create a new section
    app.post("/sections", async (req, res) => {
      try {
        const { courseCode, email, sectionName } = req.body;
        console.log(courseCode);

        if (!courseCode || !email || !sectionName) {
          return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a section with this courseCode AND email already exists
        const existingSection = await sectionsCollection.findOne({
          courseCode,
          email,
        });

        if (existingSection) {
          // If exists with same courseCode AND email, push the new sectionName to the sections array
          const result = await sectionsCollection.updateOne(
            { courseCode, email },
            {
              $push: { sections: sectionName },
              $set: { updatedAt: new Date() },
            }
          );
          res.status(200).json({
            success: true,
            message: "Section added to existing course",
            modifiedCount: result.modifiedCount,
          });
        } else {
          // If doesn't exist, create a new document
          const newSection = {
            courseCode,
            email,
            sections: [sectionName],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          const result = await sectionsCollection.insertOne(newSection);
          res.status(201).json({
            success: true,
            message: "New course section created",
            insertedId: result.insertedId,
          });
        }
      } catch (err) {
        console.error("Error creating section:", err);
        res
          .status(500)
          .json({ message: "Server error while creating section" });
      }
    });

    // Get sections by course code and email
    app.get("/sections", async (req, res) => {
      try {
        const { courseCode, email } = req.query;

        if (!courseCode || !email) {
          return res.status(400).json({
            message: "Course code and email parameters are required",
          });
        }

        const section = await sectionsCollection.findOne({
          courseCode,
          email,
        });

        if (!section) {
          return res.status(404).json({
            message: "No sections found for this course and teacher",
            sections: [], // Return empty array instead of error if preferred
          });
        }

        res.json(section);
      } catch (err) {
        console.error("Error fetching sections:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching sections" });
      }
    });

    // Get all sections for a user by email
    app.get("/sections", async (req, res) => {
      try {
        const { email } = req.query;

        if (!email) {
          return res
            .status(400)
            .json({ message: "Email parameter is required" });
        }

        const sections = await sectionsCollection.find({ email }).toArray();
        res.json(sections);
      } catch (err) {
        console.error("Error fetching user sections:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching user sections" });
      }
    });

    app.post("/section-students", async (req, res) => {
      try {
        const { email, teacherEmail, courseCode, courseId, section, status } =
          req.body;

        // Validate required fields
        if (!email || !teacherEmail || !courseCode || !courseId || !section) {
          return res
            .status(400)
            .json({ message: "All required fields must be provided" });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res
            .status(400)
            .json({ message: "Please provide a valid email address" });
        }

        // Check if student already exists in this section
        const existingStudent = await sectionStudentsCollection.findOne({
          email,
          courseCode,
          section,
        });

        if (existingStudent) {
          return res
            .status(400)
            .json({ message: "Student already exists in this section" });
        }

        // Create new section student record
        const newSectionStudent = {
          email,
          teacherEmail,
          courseCode,
          courseId,
          section,
          status: status || "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await sectionStudentsCollection.insertOne(
          newSectionStudent
        );

        res.status(201).json({
          message: "Student added to section successfully",
          student: {
            id: result.insertedId,
            ...newSectionStudent,
          },
        });
      } catch (err) {
        console.error("Error adding student to section:", err);
        res
          .status(500)
          .json({ message: "Server error while adding student to section" });
      }
    });

    app.get("/section-students", async (req, res) => {
      try {
        const { courseCode, section, email } = req.query;
        let query = {};

        if (courseCode) query.courseCode = courseCode;
        if (section) query.section = section;
        if (email) query.email = email;

        const students = await sectionStudentsCollection.find(query).toArray();
        res.json(students);
      } catch (err) {
        console.error("Error fetching section students:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching section students" });
      }
    });

    app.delete("/section-students/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await sectionStudentsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({ message: "Student not found in section" });
        }

        res.json({ message: "Student removed from section successfully" });
      } catch (err) {
        console.error("Error removing student from section:", err);
        res.status(500).json({
          message: "Server error while removing student from section",
        });
      }
    });

    app.post("/chatrooms", async (req, res) => {
      try {
        const { courseCode, section, email, message, senderType } = req.body;

        if (!courseCode || !section || !email || !message || !senderType) {
          return res.status(400).json({ message: "All fields are required" });
        }

        // Find or create chatroom
        const chatroom = await chatroomsCollection.findOneAndUpdate(
          { courseCode, section },
          {
            $setOnInsert: {
              courseCode,
              section,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            $push: {
              messages: {
                email,
                message,
                senderType,
                timestamp: new Date(),
              },
            },
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );

        res.status(201).json({
          message: "Message sent successfully",
          chatroom: chatroom.value,
        });
      } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ message: "Server error while sending message" });
      }
    });

    app.get("/chatrooms", async (req, res) => {
      try {
        const { courseCode, section } = req.query;

        if (!courseCode || !section) {
          return res
            .status(400)
            .json({ message: "Course code and section are required" });
        }

        const chatroom = await chatroomsCollection.findOne(
          { courseCode, section },
          { sort: { "messages.timestamp": -1 } }
        );

        if (!chatroom) {
          return res.status(404).json({ message: "No chatroom found" });
        }

        res.json(chatroom);
      } catch (err) {
        console.error("Error fetching chatroom:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching chatroom" });
      }
    });

    // Course Videos Endpoints
    app.post("/course-videos", upload.single("video"), async (req, res) => {
      try {
        const { courseCode, email, week, title, description } = req.body;
        const video = req.file;

        if (!courseCode || !email || !week || !video) {
          return res
            .status(400)
            .json({ message: "Required fields are missing" });
        }

        // Upload video to GridFS
        const filename = `${Date.now()}_${video.originalname}`;
        const uploadStream = gridFSBucket.openUploadStream(filename, {
          contentType: video.mimetype,
        });

        uploadStream.end(video.buffer);

        // Wait for upload to finish
        const videoInfo = await new Promise((resolve, reject) => {
          uploadStream.on("finish", () =>
            resolve({
              filename: filename,
              videoId: uploadStream.id,
              contentType: video.mimetype,
              url: `http://localhost:5000/image/${uploadStream.id}`,
            })
          );
          uploadStream.on("error", reject);
        });

        // Find or create course videos document
        const result = await courseVideosCollection.findOneAndUpdate(
          { courseCode, email },
          {
            $setOnInsert: {
              courseCode,
              email,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            $push: {
              videos: {
                week: parseInt(week),
                title,
                description,
                videoUrl: videoInfo.url,
                videoId: videoInfo.videoId,
                uploadedAt: new Date(),
                contentType: videoInfo.contentType,
                duration: 0, // You can extract duration using a video processing library
              },
            },
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );

        res.status(201).json({
          message: "Lecture video uploaded successfully",
          video: result.value,
        });
      } catch (err) {
        console.error("Error uploading lecture video:", err);
        res
          .status(500)
          .json({ message: "Server error while uploading lecture video" });
      }
    });

    app.get("/course-videos", async (req, res) => {
      try {
        const { courseCode, email } = req.query;

        if (!courseCode || !email) {
          return res
            .status(400)
            .json({ message: "Course code and email are required" });
        }

        const courseVideos = await courseVideosCollection.findOne(
          { courseCode, email },
          { sort: { "videos.uploadedAt": -1 } }
        );

        if (!courseVideos) {
          return res
            .status(404)
            .json({ message: "No lecture videos found", videosByWeek: {} });
        }

        // Group videos by week
        const videosByWeek = {};
        courseVideos.videos.forEach((video) => {
          if (!videosByWeek[video.week]) {
            videosByWeek[video.week] = [];
          }
          videosByWeek[video.week].push(video);
        });

        res.json({
          courseCode: courseVideos.courseCode,
          email: courseVideos.email,
          videosByWeek,
        });
      } catch (err) {
        console.error("Error fetching lecture videos:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching lecture videos" });
      }
    });

    app.delete("/course-videos/:videoId", async (req, res) => {
      try {
        const { videoId } = req.params;
        const { courseCode, email } = req.query;

        if (!videoId || !courseCode || !email) {
          return res
            .status(400)
            .json({ message: "Video ID, course code and email are required" });
        }

        // First delete the video from GridFS
        await gridFSBucket.delete(new ObjectId(videoId));

        // Then remove the video reference
        const result = await courseVideosCollection.updateOne(
          { courseCode, email },
          { $pull: { videos: { videoId: new ObjectId(videoId) } } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Lecture video not found" });
        }

        res.json({ message: "Lecture video deleted successfully" });
      } catch (err) {
        console.error("Error deleting lecture video:", err);
        res
          .status(500)
          .json({ message: "Server error while deleting lecture video" });
      }
    });

    app.get("/lecture-notes", async (req, res) => {
      try {
        const { courseCode, email } = req.query;

        if (!courseCode || !email) {
          return res
            .status(400)
            .json({ message: "Course code and email are required" });
        }

        const lectureNotes = await lectureNotesCollection.findOne(
          { courseCode, email },
          { sort: { "notes.uploadedAt": -1 } }
        );

        if (!lectureNotes) {
          return res
            .status(404)
            .json({ message: "No lecture notes found", notes: [] });
        }

        // Group notes by week
        const notesByWeek = {};
        lectureNotes.notes.forEach((note) => {
          if (!notesByWeek[note.week]) {
            notesByWeek[note.week] = [];
          }
          notesByWeek[note.week].push(note);
        });

        res.json({
          courseCode: lectureNotes.courseCode,
          email: lectureNotes.email,
          notesByWeek,
        });
      } catch (err) {
        console.error("Error fetching lecture notes:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching lecture notes" });
      }
    });

    app.delete("/lecture-notes/:fileId", async (req, res) => {
      try {
        const { fileId } = req.params;
        const { courseCode, email } = req.query;

        if (!fileId || !courseCode || !email) {
          return res
            .status(400)
            .json({ message: "File ID, course code and email are required" });
        }

        // First delete the file from GridFS
        await gridFSBucket.delete(new ObjectId(fileId));

        // Then remove the note reference
        const result = await lectureNotesCollection.updateOne(
          { courseCode, email },
          { $pull: { notes: { fileId: new ObjectId(fileId) } } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Lecture note not found" });
        }

        res.json({ message: "Lecture note deleted successfully" });
      } catch (err) {
        console.error("Error deleting lecture note:", err);
        res
          .status(500)
          .json({ message: "Server error while deleting lecture note" });
      }
    });

    // Get enrolled courses by student email
    app.get("/enrolled-courses", async (req, res) => {
      try {
        const { email, courseCode } = req.query;
        let query = {};

        if (email) query.studentEmail = email;
        if (courseCode) query.courseCode = courseCode;

        const courses = await enrolledCoursesCollection.find(query).toArray();
        res.json(courses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        res
          .status(500)
          .json({ message: "Server error while fetching enrolled courses" });
      }
    });

    // Enroll in a course
    app.post("/enrolled-courses", async (req, res) => {
      try {
        const {
          studentEmail,
          courseId,
          courseCode,
          courseName,
          facultyInitial,
        } = req.body;

        if (!studentEmail || !courseId || !courseCode) {
          return res
            .status(400)
            .json({ message: "Required fields are missing" });
        }

        const newEnrollment = {
          studentEmail,
          courseId,
          courseCode,
          courseName,
          facultyInitial,
          enrolledAt: new Date(),
          status: "active",
          lastAccessed: new Date(),
        };

        const result = await enrolledCoursesCollection.insertOne(newEnrollment);
        res.status(201).json({
          message: "Enrollment successful",
          enrollment: {
            id: result.insertedId,
            ...newEnrollment,
          },
        });
      } catch (err) {
        console.error("Error enrolling in course:", err);
        res
          .status(500)
          .json({ message: "Server error while enrolling in course" });
      }
    });

    // getting assignment by course id

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
run().catch(console.dir);

// Basic route
app.get("/", (req, res) => {
  res.send("Education platform is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
