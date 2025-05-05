const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const payRoutes = require('./Routes/pay.Routes');
const orderRoutes = require('./Routes/order.Routes')

const app = express();
const DBListener = require('./Config/dbConnection'); 


const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
DBListener.on('error',(err)=>{console.log(err)});

DBListener.once('open',()=>{

    console.log("✅ Connected to MongoDB"); 
    //All the routes will be here
    app.use('/pay', payRoutes);
    app.use('/api/orders', orderRoutes);

}); 


app.listen(PORT, () => { 
    console.log(`http://localhost:${PORT}`); 
}); 