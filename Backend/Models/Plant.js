const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
    name: { type: String, required: true},
    description: String,
    features: [String],
    price: { type: Number, required: true, min: 0 },
    imageUrls:[{type: String,}],
    category: { type: String, enum: [ "Indoor Plants", "Succulent & Cacti","Hanging Plants"], required: true },
    sunlightNeeds: { type: String, enum: ["Low", "Medium", "Bright"] },
    careLevel: { type: String, enum: ["Biggner", "intermediate", "Expert"] },
    size: { type: String, enum: ["Small", "Medium", "large"], required: true },
    stock: { type: Number, required: true, min: 0},
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
    rating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        default: 0 
    }
},{timestamps: true});

module.exports = mongoose.model('Plant', plantSchema);