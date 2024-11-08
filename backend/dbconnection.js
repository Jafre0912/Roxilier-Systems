const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Construct the MongoDB URI with credentials if provided
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Roxiler-systems";
    const dbURL = uri
      .replace("<username>", process.env.DB_USERNAME || "")
      .replace("<password>", process.env.DB_PASSWORD || "")
      .replace("<dbname>", process.env.DB_NAME || "Roxiler-systems");

    // Connect to MongoDB without deprecated options
    await mongoose.connect(dbURL);
    
    console.log("----------------- DB Connected -------------------");
  } catch (err) {
    console.error("DB Connection failed\n", err);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = connectDB;
