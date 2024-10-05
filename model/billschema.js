const mongoose = require('mongoose');
const AllUser = require('./allUsersSchema');

const billSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,   // Reference to the Member collection which itself references the alluser collection for access
    ref: 'Member', 
    required: true
  },
  username:{
    type:String,
    required:true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String, 
  }
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;