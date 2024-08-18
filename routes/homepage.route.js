const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static(path.join(__dirname, 'teachers-login')));
app.use(express.static(path.join(__dirname, 'student-portal')));
app.use(express.static(path.join(__dirname, 'admin-login')));
app.use('/sp-resources', express.static(path.join(__dirname, 'student-portal/sp-resources')));
app.use('/student-portal/student-dashboard', express.static(path.join(__dirname, 'student-portal/student-dashboard')));
app.use('/tl-resources', express.static(path.join(__dirname, 'teachers-login/tl-resources')));
app.use('/teachers-login/teachers-dashboard', express.static(path.join(__dirname, 'teachers-login/teachers-dashboard')));
app.use('/admin-login/admin-dashboard', express.static(path.join(__dirname, 'admin-login/admin-dashboard')));



router.get('/teachers-login', (req,res)=>{
    res.sendFile(path.join(__dirname, '../teachers-login', 'teachers-login.html'));
})

router.get('/student-portal', (req,res)=>{
    res.sendFile(path.join(__dirname, '../student-portal', 'student-portal.html'));
})

router.get('/admin-login', (req,res)=>{
    res.sendFile(path.join(__dirname, '../admin-login', 'adminLogin.html'));
})




module.exports = router;