require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

console.log(process.env.PORT);

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

    // Loop sampai dapat NIP unik
    do {
      nip = generateNIP();
      existingUser = await User.findOne({ nim_nip: nip });
    } while (existingUser);

    const hashedPassword = await bcrypt.hash("password123", 10);

    const dosen = new User({
      name: "Dosen Pembimbing",
      nim_nip: nip,
      password: hashedPassword,
      role: "dosen",
      tanggalLahir: "1975-06-01",
      noTelepon: "081234567800",
    });

    await dosen.save();
    console.log(`✅ Akun dosen berhasil dibuat dengan NIP (nim_nip): ${nip}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal membuat akun dosen:", err.message);
    process.exit(1);
  }
}

seedDosen();
