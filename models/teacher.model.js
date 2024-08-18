const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
    unique: true
  },
  teacherID: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
  },
});

TeacherSchema.pre('save', function(next) {
  if (this.mobileNumber) {
      this.teacherID = this.mobileNumber.slice(-5);
  }
  next();
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;