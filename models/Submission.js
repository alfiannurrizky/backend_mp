const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
