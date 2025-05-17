const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const DBListener = require('./Config/dbConnection'); 


const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());
const userRoute = require("./routes/UserRoutes");
const payRoutes = require('./routes/pay.Routes');
const orderRoutes = require('./routes/order.Routes')
const potRoute = require('./routes/Pot')
const reviewRoute = require('./routes/reviewRoutes')
const favRoute = require('./routes/favRoutes')
const cartRoute = require('./routes/cartRoutes')
const plantRoute = require('./routes/plantsRoutes')

// Allow requests from Angular frontend
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'productId','Authorization']
}));

// Connect to MongoDB
DBListener.on('error',(err)=>{console.log(err)});

DBListener.once('open',()=>{

    console.log("✅ Connected to MongoDB"); 
    //All the routes will be here
    app.use("/users",userRoute);
    app.use('/pay', payRoutes);
    app.use('/orders', orderRoutes);
    app.use('/review', reviewRoute);
    app.use('/pot', potRoute);
    app.use('/plant', plantRoute);
    app.use('/cart', cartRoute);
    app.use('/fav', favRoute);

}); 


app.listen(PORT, () => { 
    console.log(`http://localhost:${PORT}`); 
}); 