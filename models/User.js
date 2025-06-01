const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    nim_nip: { type: String, required: true, unique: true }, // satu field gabungan
    password: String,
    role: { type: String, enum: ["mahasiswa", "dosen"], default: "mahasiswa" },
    programStudiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramStudi",
    },
    tanggalLahir: { type: Date },
    noTelepon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
