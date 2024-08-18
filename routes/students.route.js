const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');

app.use('/student-portal/student-dashboard', express.static(path.join(__dirname, 'student-portal/student-dashboard')));


const studentsController = require('../controller/students.controller');

router.post('/student-login', studentsController.studentLogin);
router.post('/dashboard', studentsController.studentDetails);
router.get('/absentdates/:studentID', studentsController.fetchAbsentDays);
router.get('/points/:studentID', studentsController.studentAttendancePoints);

module.exports = router;