const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Attendance = require('../models/attendanceRecords.model');

exports.markAbsent = async (req, res) => {
    try {
      const { date, absentStudents, class: studentClass } = req.body;
  
      const newAttendance = new Attendance({
        class: studentClass,
        absentStudents,
        date: new Date(date),
      });
  
      await newAttendance.save();
      res.status(201).send('Attendance recorded successfully');
    } catch (error) {
      res.status(500).send('Error recording attendance');
    }
};

exports.getAttendance = async (req, res) => {
    try {
      const { class: studentClass } = req.query;

    if (!studentClass) {
      return res.status(400).send('Class parameter is required');
    }

    const records = await Attendance.find({ class: studentClass }).exec();

    res.json(records);
    
    } catch (error) {
      res.status(500).send('Error fetching attendance records');
    }
};