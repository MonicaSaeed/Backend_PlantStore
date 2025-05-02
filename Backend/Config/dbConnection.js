const mongoose = require("mongoose");

mongoose.connect(process.env.URL);
const DBListener = mongoose.connection;

DBListener.on('error',(err)=>{console.log(err)})

module.exports = DBListener;
