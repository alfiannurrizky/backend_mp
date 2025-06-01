const express = require("express");
const app = express();
const morgan = require("morgan");
const logger = require("./config/logger");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;
