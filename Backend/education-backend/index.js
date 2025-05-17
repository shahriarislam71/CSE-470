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
    const usersCollection = db.collection("users");
    const teachersCollection = db.collection("teachers");
    const studentsCollection = db.collection("students");
    const coursesCollection = db.collection("courses"); // New collection for courses

    // Mount assignment routes after db is available
    const assignmentRoutes = require("./SabbirApi/routes/assignmentRoutes");
    app.use("/api/assignments", assignmentRoutes(db));

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

    // update the code
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
    app.get("/courses/:id", async (req, res) => {
      try {
        const { id } = req.params;
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





