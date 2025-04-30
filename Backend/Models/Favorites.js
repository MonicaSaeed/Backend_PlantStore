const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favoritesSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }],
    Pots: [{ type: Schema.Types.ObjectId, ref: 'Pot' }]
},{timestamps: true});

module.exports = mongoose.model('Favorites', favoritesSchema);