const mongoose = require('mongoose');
const { Timestamp } = require('bson');

const allUsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        minlength: 6,
        required: true, 
    },
    role: {
        type: String,
        enum: ['admin', 'member', 'user'], 
        required: true,
    },
    signupDate: {
        type: Date,
        default: Date.now, 
    },
    lastLogin: {
        type: Date, 
    },
});

const AllUser = mongoose.model('allUser', allUsersSchema);
module.exports = AllUser;