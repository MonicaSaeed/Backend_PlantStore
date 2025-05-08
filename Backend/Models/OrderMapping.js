const mongoose = require('mongoose');
const Order = require('./Order');
const orderMappingSchema = new mongoose.Schema({
  mongoOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order', // Update this if your order model has a different name
  },
  paymobOrderId: {
    type: Number,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('OrderMapping', orderMappingSchema);
