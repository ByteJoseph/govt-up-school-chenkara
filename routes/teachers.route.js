const express = require('express');
const router = express.Router();

const teachersController = require('../controller/teachers.controller');

router.post('/teachers-login', teachersController.teachersLogin);
router.post('/dashboard', teachersController.teacherDetails);
router.post('/createnewstudent', teachersController.createNewStudent);
router.get('/fetchstudentsbyclass', teachersController.fetchStudentByClass);
router.delete('/deletestudent/:id', teachersController.deletestudent);
router.post('/markabsent', teachersController.markAbsent);

module.exports = router;