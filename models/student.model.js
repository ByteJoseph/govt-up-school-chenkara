const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    studentName: {
        type: String,
        required: [true, "Please enter the student name"]
    },
    studentClass: {
      type: Number,
      required: true,  
    },
    studentGender: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherNumber: {
        type: String,
        required: true
    },
    fatherNumber: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    absentDates: {
        type: [Date],
        default: []
    }
})


StudentSchema.virtual('points').get(function() {
    const absentDatesArray = this.absentDates || [];
    const initialPoints = 1000;
    const deductionPerAbsence = 20;
    return initialPoints - (absentDatesArray.length * deductionPerAbsence);
});
  
StudentSchema.set('toJSON', { virtuals: true });




StudentSchema.pre('save', function(next) {

    try {
        if (!this.studentName) throw new Error("Student name is required");
        if (this.motherNumber.length < 5) throw new Error("Mother's phone number is too short");

        this.studentID = this.studentName.toLowerCase().replace(/\s+/g, '');
        this.password = this.motherNumber.slice(-5);

        next();
    } catch (error) {
        next(error);
    }
    
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;