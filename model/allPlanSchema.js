const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planName: { 
    type: String, 
    required: true 
  },
  planDuration: { 
    type: String, //'3 months', '1 year'
    required: true 
  },
  planPrice: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
  },
  planLogoUrl: {
    type: String,
  }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;