const express = require("express");
const router = express.Router();

const submissionController = require("../controllers/submissionController");
const verifyToken = require("../middlewares/verifyToken");
const authorizeRole = require("../middlewares/authorizeRole");
const {
  submissionValidationRules,
  validate,
} = require("../validators/submissionValidator");

// MAHASISWA: Kirim judul skripsi
router.post(
  "/",
  verifyToken,
  authorizeRole("mahasiswa"),
  submissionValidationRules(),
  validate,
  submissionController.createSubmission
);

// MAHASISWA: Lihat daftar pengajuan sendiri
router.get(
  "/my",
  verifyToken,
  authorizeRole("mahasiswa"),
  submissionController.getMySubmissions
);

// DOSEN: Lihat semua pengajuan mahasiswa
router.get(
  "/",
  verifyToken,
  authorizeRole("dosen"),
  submissionController.getAllSubmissions
);

// DOSEN: Update status pengajuan (ACC / Revisi / Pending)
router.patch(
  "/:id",
  verifyToken,
  authorizeRole("dosen"),
  submissionController.updateStatus
);

module.exports = router;
