const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Connecting to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/StudentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Defining the User Schema
const UserSchema = new mongoose.Schema({
    id: Number,
    name: String
});

const UserModel = mongoose.model("student", UserSchema);

// Route to add a new student
app.post("/addstudent", (req, res) => {
    const newStudent = new UserModel(req.body); // Create a new UserModel instance with the request body
    newStudent.save()
        .then(() => {
            res.status(201).send("Student added successfully");
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.status(500).send("An error occurred while adding the student");
        });
});


// Route to fetch all students
app.get("/students", (req, res) => {
    UserModel.find()
        .then((students) => {
            res.status(200).json(students);
        })
        .catch((err) => {
            console.error("Error fetching students:", err);
            res.status(500).send("An error occurred while fetching students");
        });
});


//Update
// Route to update a student by ID
app.put("/updatestudent/:id", (req, res) => {
    const studentId = req.params.id;
    const updatedData = req.body;

    UserModel.findOneAndUpdate({ id: studentId }, updatedData, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).send("Student not found");
            }
            res.status(200).json(updatedStudent);
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send("An error occurred while updating the student");
        });
});


//Delete
// Route to delete a student by ID
app.delete("/deletestudent/:id", (req, res) => {
    const studentId = req.params.id;

    UserModel.findOneAndDelete({ id: studentId })
        .then((deletedStudent) => {
            if (!deletedStudent) {
                return res.status(404).send("Student not found");
            }
            res.status(200).send("Student deleted successfully");
        })
        .catch((err) => {
            console.error("Error deleting student:", err);
            res.status(500).send("An error occurred while deleting the student");
        });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
