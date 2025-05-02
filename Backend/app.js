const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const payRoutes = require('./routes/payRoutes');

const app = express();
const DBListener = require('./Config/dbConnection'); 
const plantRoutes = require('./Routes/plantsRoutes');
const favRoutses = require('./Routes/favRoutes');
const cart = require('./Models/Cart');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
DBListener.on('error',(err)=>{console.log(err)});

DBListener.once('open',()=>{

    console.log("✅ Connected to MongoDB"); 
    //All the routes will be here
    app.use('/pay', payRoutes);
    app.use('/api/plants', plantRoutes);
    app.use('/api/favorites', favRoutses);


}); 


app.listen(PORT, () => { 
    console.log(`http://localhost:${PORT}`); 
}); 