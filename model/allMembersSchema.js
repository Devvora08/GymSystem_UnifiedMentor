const mongoose = require('mongoose');
const { Timestamp } = require('bson');
const AllUser = require('./allUsersSchema');
const allMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AllUser'
    },
    membershipPlan: {
        type: String,
        required: true,
    },
    planDuration: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    cart: {
        type: String,
        default: '',
    },
});

const AllMember = mongoose.model('Member', allMemberSchema);

module.exports = AllMember;


