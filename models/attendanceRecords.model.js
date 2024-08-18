const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  absentStudents: [String],
  date: {
    type: Date,
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;