const Submission = require("../models/Submission");
const logger = require("../config/logger");

// [POST] Mahasiswa kirim judul
exports.createSubmission = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;

  logger.info(
    `Upaya pembuatan pengajuan baru oleh pengguna ID: ${userId} dengan judul: "${title}"`
  );

  try {
    const submission = new Submission({
      title,
      description,
      status: "pending",
      user: userId,
      createdAt: new Date(),
    });

    await submission.save();

    logger.info(
      `Pengajuan ID ${submission._id} berhasil dibuat oleh pengguna ID: ${userId}.`
    );

    res.status(201).json({
      success: true,
      message: "Pengajuan berhasil dikirim",
      data: submission,
    });
  } catch (err) {
    logger.error(
      `Gagal membuat pengajuan untuk pengguna ID ${userId}: ${err.message}`,
      {
        stack: err.stack,
        requestBody: { title, description },
        requestPath: req.path,
        requestMethod: req.method,
      }
    );

    res.status(500).json({
      success: false,
      message: "Gagal mengirim pengajuan",
      error: err.message,
    });
  }
};

// [GET] Mahasiswa cek pengajuan milik sendiri
exports.getMySubmissions = async (req, res) => {
  const userId = req.user.userId;

  logger.info(`Upaya pengambilan data pengajuan oleh pengguna ID: ${userId}`);

  try {
    const submissions = await Submission.find({ user: userId }).sort({
      createdAt: -1,
    });

    const totalPengajuan = submissions.length;
    let pengajuanAcc = 0;
    let pengajuanRevisi = 0;
    let pengajuanPending = 0;

    submissions.forEach((submission) => {
      if (submission.status === "acc") {
        pengajuanAcc++;
      } else if (submission.status === "revisi") {
        pengajuanRevisi++;
      } else if (submission.status === "pending") {
        pengajuanPending++;
      }
    });

    logger.info(
      `Berhasil mengambil ${totalPengajuan} pengajuan untuk pengguna ID ${userId}. Statistik: ACC=${pengajuanAcc}, Revisi=${pengajuanRevisi}, Pending=${pengajuanPending}.`
    );

    res.json({
      success: true,
      message: "Data pengajuan berhasil diambil.",
      data: submissions,
      stats: {
        totalPengajuan: totalPengajuan,
        pengajuanAcc: pengajuanAcc,
        pengajuanRevisi: pengajuanRevisi,
        pengajuanMenunggu: submissions.filter((s) => s.status === "pending")
          .length,
      },
    });
  } catch (err) {
    logger.error(
      `Terjadi kesalahan saat mengambil pengajuan untuk pengguna ID ${userId}: ${err.message}`,
      {
        stack: err.stack,
        requestPath: req.path,
        requestMethod: req.method,
      }
    );

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pengajuan.",
      error: err.message,
    });
  }
};

// [GET] Dosen melihat semua pengajuan
exports.getAllSubmissions = async (req, res) => {
  logger.info("Upaya pengambilan semua data pengajuan (untuk dosen).");

  try {
    const submissions = await Submission.find().populate("user", "name email");

    logger.info(`Berhasil mengambil ${submissions.length} data pengajuan.`);

    res.json({ data: submissions });
  } catch (err) {
    logger.error(`Gagal mengambil semua data pengajuan: ${err.message}`, {
      stack: err.stack,
      requestPath: req.path,
      requestMethod: req.method,
    });

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
      logger.warn(
        `Update status gagal untuk pengajuan "${status}" tidak valid.`
      );

      return res.status(400).json({ message: "Status tidak valid" });
    }

    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!updated) {
      logger.warn(`Update status gagal: Pengajuan tidak ditemukan.`);

      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    logger.info(
      `Status pengajuan ID ${updated.id} berhasil diupdate menjadi "${updated.status}"`
    );

    res.json({ message: "Status berhasil diupdate", data: updated });
  } catch (err) {
    logger.error(
      `Terjadi kesalahan saat mengupdate status pengajuan: ${err.message}`
    );

    res
      .status(500)
      .json({ message: "Gagal update status", error: err.message });
  }
};
