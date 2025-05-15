const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

async function run() {
  try {
    await client.connect();

    // Initialize collections
    const db = client.db("education");
    const usersCollection = db.collection("users");
    const teachersCollection = db.collection("teachers");
    const studentsCollection = db.collection("students"); // New collection for students

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

    // Create indexes for email uniqueness
    await teachersCollection.createIndex({ email: 1 }, { unique: true });
    await studentsCollection.createIndex({ email: 1 }, { unique: true });

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


// getting assignment by course id

app.post("/assignments", async (req, res) => {
  try {
    const { courseTitle, title, description, dueDate, postedBy } = req.body;

    if (!courseTitle || !title || !dueDate || !postedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAssignment = {
      courseTitle,
      title,
      description,
      dueDate: new Date(dueDate),
      postedBy,
      createdAt: new Date()
    };

    const result = await assignmentsCollection.insertOne(newAssignment);
    res.status(201).json({
      message: "Assignment created successfully",
      assignment: { id: result.insertedId, ...newAssignment }
    });
  } catch (err) {
    console.error("Error creating assignment:", err);
    res.status(500).json({ message: "Server error while creating assignment" });
  }
});



