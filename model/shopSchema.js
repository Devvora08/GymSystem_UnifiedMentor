const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Supplement', 'Equipment', 'Health and Wellness', 'Clothing & Accessories'], // Add your categories here
    required: true, // You can make this required if necessary
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String, // This will store the image URL or file path
    required: true
  }
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;

