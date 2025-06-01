const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Koneksi MongoDB berhasil");
  } catch (err) {
    logger.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
