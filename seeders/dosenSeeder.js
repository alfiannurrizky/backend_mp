require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Koneksi ke DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Terhubung ke MongoDB");
    seedDosen();
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke database:", err.message);
  });

async function seedDosen() {
  try {
    const existing = await User.findOne({ email: "dosen@email.com" });
    if (existing) {
      console.log("⚠️ Akun dosen sudah ada.");
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const dosen = new User({
      name: "Dosen Pembimbing",
      email: "dosen@email.com",
      password: hashedPassword,
      role: "dosen",
    });

    await dosen.save();
    console.log("✅ Akun dosen berhasil dibuat");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal membuat akun dosen:", err.message);
    process.exit(1);
  }
}
