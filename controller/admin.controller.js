const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Admin = require("../models/admin.model");

exports.registernewadmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminlogin = async (req, res) => {
  const { adminID, adminPassword } = req.body;
  console.log(`Student login attempt with`, { adminID, adminPassword });

  try {
    const admin = await Admin.findOne({ adminID, adminPassword });
    if (admin) {
      console.log(admin);
      res.json({
        success: true,
        message: "Login successful",
        redirectUrl: `/admin-login/admin-dashboard/adminDashboard.html?adminID=${adminID}`,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.createNewTeacher = async (req, res) => {
  console.log("query received for creating teacher with data:", req.body);
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();

    res.status(201).json({
      message: "Student created successfully",
      teacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Failed to create teacher" });
  }
};
