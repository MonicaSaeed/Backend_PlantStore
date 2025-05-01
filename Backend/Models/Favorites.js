const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favoritesSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true,unique: true },
    plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }],
    pots: [{ type: Schema.Types.ObjectId, ref: 'Pot' }]
},{timestamps: true},{versionKey: false});

module.exports = mongoose.model('Favorites', favoritesSchema);