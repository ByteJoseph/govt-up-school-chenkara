const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin.controller');

router.post('/registeradmin/new', adminController.registernewadmin);
router.post('/security/adminlogin', adminController.adminlogin)
router.post('/createnewteacher/new', adminController.createNewTeacher);


module.exports = router;