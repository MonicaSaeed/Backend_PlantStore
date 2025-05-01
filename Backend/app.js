const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require("./Config/dbConnection");
const payRoutes = require('./routes/payRoutes');
const app = express();
const plantRoutes = require('./Routes/plantsRoutes');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/pay', payRoutes);
app.use('/api/plants', plantRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});