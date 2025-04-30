const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    item: {
            id: { type: Schema.Types.ObjectId, required: true },
            type: { type: String, enum: ["plant", "pot"], required: true }
    },
    rating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        default: 0 
    },    
    comment: String
},{timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);