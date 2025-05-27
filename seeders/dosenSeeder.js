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
    // Fungsi generate NIP unik (contoh: 198012345678)
    function generateNIP() {
      const prefix = "1980";
      const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8 digit random
      return prefix + randomDigits.toString();
    }

    let nip;
    let existingUser;

    // Loop sampai dapat nip unik
    do {
      nip = generateNIP();
      existingUser = await User.findOne({ nim_nip: nip });  // cek ke nim_nip
    } while (existingUser);

    const hashedPassword = await bcrypt.hash("password123", 10);

    const dosen = new User({
      name: "Dosen Pembimbing",
      email: nip,         // kalau mau isi, boleh pakai nip sebagai email juga
      nim_nip: nip,       // pakai field gabungan nim_nip
      password: hashedPassword,
      role: "dosen",
    });

    await dosen.save();
    console.log(`✅ Akun dosen berhasil dibuat dengan NIP (nim_nip): ${nip}`);
    process.exit();
  } catch (err) {
    console.error("❌ Gagal membuat akun dosen:", err.message);
    process.exit(1);
  }
}
