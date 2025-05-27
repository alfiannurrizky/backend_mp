const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["mahasiswa", "dosen"], default: "mahasiswa" },
    nim_nip: { type: String, required: true, unique: true }, // satu field gabungan
    programStudiId: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramStudi" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
