const Submission = require("../models/Submission");

// [POST] Mahasiswa kirim judul
exports.createSubmission = async (req, res) => {
  try {
    const { title, description } = req.body;

    const submission = new Submission({
      title,
      description,
      status: "pending",
      user: req.user.userId, // dari JWT
      createdAt: new Date(),
    });

    await submission.save();
    res
      .status(201)
      .json({ message: "Pengajuan berhasil dikirim", data: submission });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengirim pengajuan", error: err.message });
  }
};

// [GET] Mahasiswa cek pengajuan milik sendiri
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json({ data: submissions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
};

// [GET] Dosen melihat semua pengajuan
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().populate("user", "name email");
    res.json({ data: submissions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil semua data", error: err.message });
  }
};

// [PATCH] Dosen update status ACC / Revisi
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["acc", "revisi", "pending"];

    if (!allowedStatus.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Status berhasil diupdate", data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal update status", error: err.message });
  }
};
