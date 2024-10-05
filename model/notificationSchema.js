const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  datePosted: {
    type: Date,
    default: Date.now
  },
  visibleTo: {
    type: [String], 
    default: ['member'] 
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;