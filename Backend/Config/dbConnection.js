const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log("✅ Connected to MongoDB");

        const listenerDB = mongoose.connection;
        listenerDB.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err.message);
        });

        return listenerDB;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
