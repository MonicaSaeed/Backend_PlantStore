const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemsPlant: [
        {
            plantId: { type: Schema.Types.ObjectId, ref: 'Plant' },
            quantity: { type:Number, min: 1, default: 1  }
        }
        ],
    itemsPot: [
        {
            plantId: { type: Schema.Types.ObjectId, ref: 'Pot' },
            quantity: { type:Number, min: 1, default: 1  }
        }
    ]
},{timestamps: true, versionKey: false});

module.exports = mongoose.model('Cart', cartSchema, 'carts');