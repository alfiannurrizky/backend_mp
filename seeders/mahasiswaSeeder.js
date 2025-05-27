require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ProgramStudi = require("../models/ProgramStudi");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Terhubung ke MongoDB");
    return seedData();
  })
  .then(() => {
    console.log("🎉 Semua data berhasil disimpan!");
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });

async function seedData() {
  console.log("🚀 Mulai proses seed data...");

  const programStudiList = [
    { fakultas: "Teknik Informatika" },
    { fakultas: "Sistem Informasi" },
    { fakultas: "Teknik Elektro" },
    { fakultas: "Teknik Sipil" },
    { fakultas: "Manajemen" },
    { fakultas: "Akuntansi" },
  ];

  const savedPrograms = [];
  for (const prog of programStudiList) {
    let existingProg = await ProgramStudi.findOne({ fakultas: prog.fakultas });
    if (existingProg) {
      console.log(`⚠️ Program studi ${prog.fakultas} sudah ada, dilewati.`);
      savedPrograms.push(existingProg);
      continue;
    }
    const newProg = new ProgramStudi(prog);
    await newProg.save();
    console.log(`✅ Program studi ${prog.fakultas} berhasil dibuat.`);
    savedPrograms.push(newProg);
  }

  const mahasiswaList = [
    { name: "Muhamad Azis" },
    { name: "Siti Nurhaliza" },
    { name: "Budi Santoso" },
    { name: "Dewi Anggraini" },
    { name: "Rudi Hartono" },
    { name: "Lina Marlina" },
  ];

  function generateNIM() {
    const prefix = "2025";
      const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8 digit random
      return prefix + randomDigits.toString();
  }

  for (let i = 0; i < mahasiswaList.length; i++) {
    let nim_nip;
    let existingUser;
    do {
      nim_nip = generateNIM();
      existingUser = await User.findOne({ nim_nip });
    } while (existingUser);

    const hashedPassword = await bcrypt.hash("password123", 10);

    const programStudi = savedPrograms[i % savedPrograms.length];

    const newMahasiswa = new User({
      name: mahasiswaList[i].name,
      email: nim_nip,
      nim_nip: nim_nip,  // gunakan field baru
      password: hashedPassword,
      role: "mahasiswa",
      programStudiId: programStudi._id,
    });

    await newMahasiswa.save();
    console.log(`✅ Akun ${nim_nip} berhasil dibuat dengan program studi ${programStudi.fakultas}.`);
  }
}
