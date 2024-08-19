const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/student.model');
const Teacher = require('./models/teacher.model');
const teachersRoute = require('./routes/teachers.route');
const studentsRoute = require('./routes/students.route');
const homepageRoute = require('./routes/homepage.route');
const adminRoute = require('./routes/admin.route');
const attendanceRecordsRoute = require('./routes/attendanceRecords.route');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'index-file')));
app.use(express.static(path.join(__dirname, 'teachers-login')));
app.use(express.static(path.join(__dirname, 'student-portal')));
app.use(express.static(path.join(__dirname, 'admin-login')));
app.use('/student-portal/student-dashboard', express.static(path.join(__dirname, 'student-portal/student-dashboard')));
app.use('/teachers-login/teachers-dashboard', express.static(path.join(__dirname, 'teachers-login/teachers-dashboard')));
app.use('/admin-login/admin-dashboard', express.static(path.join(__dirname, 'admin-login/admin-dashboard')));
app.use('/404-resources', express.static(path.join(__dirname, '404page', '404-resources')));
app.use(express.static(path.join(__dirname, '404page')));


// Session middleware
app.use(session({
  secret: 'cors-key-value',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true } 
}));

const allowedOrigin = 'https://govt-up-school-chenkara.onrender.com';

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));



// Routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index-file', 'index.html'));
});

//health
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Route-servings
app.use('/teachers', teachersRoute);
app.use('/students', studentsRoute);
app.use('/attendanceRecords', attendanceRecordsRoute); // Fixed typo
app.use('/homepage', homepageRoute);
app.use('/adminaccess', adminRoute);


//404 Error Handling
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '404page', '404.html'));
});


// Database and port connections
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`The app is listening at http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error("Connection to the database failed!", error);
  });



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
