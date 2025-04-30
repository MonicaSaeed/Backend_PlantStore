const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require("./Config/dbConnection");

const payRoutes = require('./routes/payRoutes');
const potRoute=require('./Routes/Pot')
const app = express();
app.use(bodyParser.json());

app.use('/pay', payRoutes);

app.use('/api/pot',potRoute);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});