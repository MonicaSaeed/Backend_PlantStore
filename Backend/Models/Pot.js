const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const potSchema = new Schema({
    name: { type: String, required: true },
    material: { type: String, enum: ['Ceramic', 'Terracotta', 'Basket'],required: true },
    color: { type: String, required: true },
    size: { type: String, enum: ["Small", "Medium", "large"], required: true },
    price: { type: Number, required: true , min: 0},
    stock: { type: Number, required: true, min: 0},
    description: String,
    imageUrls:[{type: String,}],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
    rating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        default: 0 
    }
},{timestamps: true});

module.exports = mongoose.model('Pot', potSchema);