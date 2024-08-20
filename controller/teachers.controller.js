const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const session = require("express-session");

exports.teachersLogin = async (req, res) => {
  const { teacherID, password } = req.body;
  console.log("Login attempt with:", { teacherID, password });

  try {
    const teacher = await Teacher.findOne({ teacherID, password });
    if (teacher) {
      req.session.teacherID = teacherID;
      console.log(teacher);
      res.json({
        success: true,
        message: "Login successful",
        redirectUrl: `/teachers-login/teachers-dashboard/teachersDashboard.html?teacherID=${teacherID}`,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.teacherDetails = async (req, res) => {
  const { teacherID } = req.body;
  console.log(`Received request for teacher ID: ${teacherID}`);

  try {
    const teacher = await Teacher.findOne({ teacherID });
    console.log(`Found teacher: ${teacher}`);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.createNewStudent = async (req, res) => {
  
  console.log("query received for creating students with data:", req.body)
  try {
    const student = new Student(req.body);
    await student.save();

    res.status(201).json({
      message: "Student created successfully",
      student,
    });

  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Failed to create student" });
  }
};


exports.fetchStudentByClass = async(req,res)=>{
  let studentClass = parseInt(req.query.studentClass, 10); // Convert to number

  if (isNaN(studentClass)) {
      return res.status(400).json({ message: 'Invalid student class' });
  }

  console.log(`Received request to fetch students for class: ${studentClass}`);

  try {

    const students = await Student.find({ studentClass }).select('_id studentName');

    
    //const studentNames = students.map(student => student.studentName);
    //console.log(studentNames);

    console.log('Fetched students:', students);

    res.json(students);


  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.deletestudent = async (req,res)=>{
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.markAbsent = async (req, res) => {
  const { date, absentStudents } = req.body;

  try {
    await Student.updateMany(
      { _id: { $in: absentStudents } },
      { $push: { absentDates: date } }
    );

    res.status(200).json({ message: "Absent students updated successfully" });
  } catch (error) {
    console.error("Error updating absent students:", error);
    res.status(500).json({ message: "Failed to update absent students" });
  }
};