const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");

exports.studentLogin = async (req, res) => {
  const { studentID, password } = req.body;
  console.log(`Student login attempt with`, { studentID, password });

  try {
    const student = await Student.findOne({ studentID, password });
    if (student) {
      req.session.studentID = studentID;
      console.log(student);
      res.json({
        success: true,
        message: "Login successful",
        redirectUrl: `/student-portal/student-dashboard/studentDashboard.html?studentID=${studentID}`,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.studentDetails = async (req, res) => {
  const { studentID } = req.body;
  console.log(`Received request for student ID: ${studentID}`);

  try {
    const student = await Student.findOne({ studentID });
    console.log(`Found student: ${student}`);

    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.fetchAbsentDays = async (req, res) => {
  const studentID = req.params.studentID;
  
  try {
    const student = await Student.findOne({studentID}).select('absentDates');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student.absentDates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


exports.studentAttendancePoints =  async (req, res) => {
  try {
    const studentID = req.params.studentID;
    const student = await Student.findOne({studentID}).exec();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      name: student.name,
      absentDates: student.absentDates,
      points: student.points,
    });
  } catch (error) {
    console.error('Error fetching student info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};