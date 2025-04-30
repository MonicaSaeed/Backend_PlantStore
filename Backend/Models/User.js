const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: "user"},
    addresses: [{ type: String }],
    favorites: { type: Schema.Types.ObjectId, ref: 'Favorites' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);