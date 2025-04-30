const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemsPlant: [
        {
        plantId: { type: Schema.Types.ObjectId, ref: 'Plant' },
        quantity: { type:Number, min:1, default:1 }
        }
    ],
    itemsPot: [
        {
            pottId: { type: Schema.Types.ObjectId, ref: 'Pot' },
            quantity: { type:Number, min:1, default:1 }
        }
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered'] },
    shippingAddress: String,
    paymentStatus: { type: String, enum: ['onDelivere', 'paid'] },
    TraxId: { type: String }
    
},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema);