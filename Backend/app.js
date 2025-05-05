const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const payRoutes = require('./routes/payRoutes');

const app = express();
const DBListener = require('./Config/dbConnection'); 


const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());
const reviewRoute = require('./Routes/reviewRoutes')

// Allow requests from Angular frontend
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'productId']
}));

// Connect to MongoDB
DBListener.on('error',(err)=>{console.log(err)});

DBListener.once('open',()=>{

    console.log("✅ Connected to MongoDB"); 
    //All the routes will be here
    app.use('/pay', payRoutes);
    app.use('/review', reviewRoute);


}); 


app.listen(PORT, () => { 
    console.log(`http://localhost:${PORT}`); 
}); 