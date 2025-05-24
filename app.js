const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

module.exports = app;
