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
    seedMahasiswa();
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke database:", err.message);
  });

async function seedMahasiswa() {
  try {
    const existing = await User.findOne({ email: "azis@email.com" });
    if (existing) {
      console.log("⚠️ Akun mahasiswa sudah ada.");
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const dosen = new User({
      name: "Muhamad Azis",
      email: "azis@email.com",
      password: hashedPassword,
      role: "mahasiswa",
    });

    await dosen.save();
    console.log("✅ Akun mahasiswa berhasil dibuat");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal membuat akun mahasiswa:", err.message);
    process.exit(1);
  }
}
