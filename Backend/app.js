const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require("./Config/dbConnection");

const payRoutes = require('./routes/payRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/pay', payRoutes);

// Connect to MongoDB
(async () => {
    try {
        const listenerDB = await connectDB();

        listenerDB.once('open', () => {
            app.get(['/', '/main'], (req, res) => {
                res.send("Welcome to the home page"); // Placeholder
            });
            // const userRoute = require("../Backend/Routes/UserRoutes");
            // app.use("/api/users",userRoute);
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("App initialization failed:", error.message);
    }
})();
