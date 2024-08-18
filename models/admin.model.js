const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    adminID: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;