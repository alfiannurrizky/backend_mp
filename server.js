require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const logger = require("./config/logger");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server berjalan di port ${PORT}`);
});
