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
  read:{
    type: String,
    enum: ['read','unread'],
    default:'unread',
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;