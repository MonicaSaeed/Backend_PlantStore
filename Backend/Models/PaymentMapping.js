const mongoose = require('mongoose');

const paymentMappingSchema = new mongoose.Schema({
  paymobOrderId: { type: String, required: true, unique: true },
  mongoOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentInfo: {
    id: String,
    amount_cents: String,
    currency: String,
    created_at: String,
    source_data: {
      type: { type: String },
      pan: String,
      sub_type: String
    },
    success: String,
    txn_response_code: String
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMapping', paymentMappingSchema);
