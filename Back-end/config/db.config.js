const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.CONNECTION_STRING) {
            console.error("CONNECTION_STRING is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(process.env.CONNECTION_STRING);

        console.log("MongoDB Connected");
    } catch (err) {
        console.error(`Database connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
