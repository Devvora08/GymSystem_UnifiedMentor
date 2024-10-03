const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AllUser'
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
    }, 
    mobileNumber: {
        type: String,
        required: true,
    },  
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;