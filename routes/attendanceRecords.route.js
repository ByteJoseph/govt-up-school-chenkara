const express = require('express');
const router = express.Router();
const attendanceRecordsController = require('../controller/attendanceRecords.controller');


router.post('/markabsent', attendanceRecordsController.markAbsent);
router.get('/getattendance', attendanceRecordsController.getAttendance);




module.exports = router;