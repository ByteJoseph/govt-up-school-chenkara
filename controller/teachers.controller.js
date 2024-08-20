const { body, query, param, validationResult } = require('express-validator');
const { sanitize } = require('validator');
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const session = require("express-session");

// Middleware for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.teachersLogin = [
  body('teacherID').trim().escape(),
  body('password').trim().escape(),
  validate,
  async (req, res) => {
    const { teacherID, password } = req.body;
    console.log("Login attempt with:", { teacherID });

    try {
      const teacher = await Teacher.findOne({ teacherID, password });
      if (teacher) {
        req.session.teacherID = teacherID;
        res.json({
          success: true,
          message: "Login successful",
          redirectUrl: `/teachers-login/teachers-dashboard/teachersDashboard.html?teacherID=${encodeURIComponent(teacherID)}`,
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
];

exports.teacherDetails = [
  body('teacherID').trim().escape(),
  validate,
  async (req, res) => {
    const { teacherID } = req.body;
    console.log(`Received request for teacher ID: ${teacherID}`);

    try {
      const teacher = await Teacher.findOne({ teacherID });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      res.json({
        teacher: sanitize(teacher),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
];

exports.createNewStudent = [
  body('studentName').trim().escape(),
  body('studentClass').isInt().toInt(),
  body('studentGender').trim().escape(),
  body('motherName').trim().escape(),
  body('fatherName').trim().escape(),
  body('motherNumber').trim().escape(),
  body('fatherNumber').trim().escape(),
  validate,
  async (req, res) => {
    console.log("query received for creating students with data:", req.body);

    try {
      const student = new Student(req.body);
      await student.save();

      res.status(201).json({
        message: "Student created successfully",
        student: sanitize(student),
      });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  }
];

exports.fetchStudentByClass = [
  query('studentClass').isInt().toInt(),
  validate,
  async (req, res) => {
    const studentClass = req.query.studentClass;
    console.log(`Received request to fetch students for class: ${studentClass}`);

    try {
      const students = await Student.find({ studentClass }).select('_id studentName');
      res.json(students.map(student => ({
        _id: student._id,
        studentName: sanitize(student.studentName),
      })));
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
];

exports.deletestudent = [
  param('id').isMongoId(),
  validate,
  async (req, res) => {
    try {
      const studentId = req.params.id;
      await Student.findByIdAndDelete(studentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.markAbsent = [
  body('date').isISO8601(),
  body('absentStudents').isArray().custom(array => array.every(item => typeof item === 'string')),
  validate,
  async (req, res) => {
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
  }
];
