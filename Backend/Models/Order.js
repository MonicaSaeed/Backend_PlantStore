const User = require('../Models/User');
const Plant = require('../Models/Plant');
const Pot = require('../Models/Pot');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    itemsPlant: [
        {
            plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
            quantity: { type: Number, min: 1, default: 1 }
        }
    ],

    itemsPot: [
        {
            potId: { type: Schema.Types.ObjectId, ref: 'Pot', required: true },
            quantity: { type: Number, min: 1, default: 1 }
        }
    ],

    totalAmount: { type: Number, required: true, min: 0 },

    orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },

    shippingAddress: { type: String, required: true },

    paymentStatus: { type: String, enum: ['pending', 'onDelivery', 'paid'], default: 'waiting' },
    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
