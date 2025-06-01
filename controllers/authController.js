const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const programStudi = require("../models/ProgramStudi");

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const userId = req.user.userId;

    logger.info(`Upaya perubahan password oleh pengguna ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      logger.warn(
        `Perubahan password gagal: Pengguna ID ${userId} tidak ditemukan.`
      );

      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      logger.warn(
        `Perubahan password gagal untuk pengguna ID ${userId}: Password lama salah.`
      );

      return res.status(401).json({
        success: false,
        message: "Password lama salah.",
      });
    }

    if (newPassword !== confirmPassword) {
      logger.warn(
        `Perubahan password gagal untuk pengguna ID ${userId}: Konfirmasi password tidak cocok.`
      );

      return res.status(400).json({
        success: false,
        message: "Konfirmasi password tidak cocok.",
      });
    }

    logger.info(
      `Hashing dan menyimpan password baru untuk pengguna ID: ${userId}.`
    );

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    logger.info(`Password berhasil diubah untuk pengguna ID: ${userId}.`);

    return res.status(200).json({
      success: true,
      message: "Password berhasil diubah.",
    });
  } catch (error) {
    logger.error(
      `Terjadi kesalahan server saat mengubah password: ${error.message}`,
      {
        stack: error.stack,
        requestPath: req.path,
        requestMethod: req.method,
      }
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { nim_nip, password } = req.body;

    const user = await User.findOne({ nim_nip }).populate("programStudiId");

    logger.info(`Upaya masuk untuk nim/nip: ${nim_nip}`);

    if (!user) {
      logger.warn(`Login gagal untuk nim/nip: ${nim_nip} - User not found.`);
      return res.status(401).json({
        success: false,
        message: "nim_nip atau password salah",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.warn(
        `Login gagal untuk nim/nip: ${nim_nip} - nim_nip atau password salah.`
      );
      return res.status(401).json({
        success: false,
        message: "nim_nip atau password salah",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const data = {
      name: user.name,
      role: user.role,
      programStudi: user.programStudiId?.fakultas ?? "Tidak diketahui",
    };

    logger.info(
      `User ${user.name} (${nim_nip}) berhasil login sebagai ${user.role}.`
    );

    res.status(200).json({
      success: true,
      message: "Login Berhasil",
      data: data,
      token,
    });
  } catch (error) {
    logger.error(
      `Server error saat login untuk nim/nip ${nim_nip}: ${err.message}`,
      { stack: err.stack }
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.userId;

    logger.info(`Upaya mengambil data profil untuk pengguna ID: ${userId}`);

    const user = await User.findById(userId).select("-password -__v").populate({
      path: "programStudiId",
      select: "fakultas -_id",
    });

    if (!user) {
      logger.warn(`Pengguna dengan ID: ${userId} tidak ditemukan.`);
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan.",
      });
    }

    logger.info(`Data profil berhasil diambil untuk pengguna ID: ${userId}.`);

    res.status(200).json({
      success: true,
      message: "Data akun berhasil diambil.",
      data: user,
    });
  } catch (error) {
    logger.error(
      `Terjadi kesalahan saat mengambil profil pengguna ID ${
        req.user ? req.user.userId : "Tidak Diketahui"
      }: ${error.message}`,
      {
        stack: error.stack,
        requestPath: req.path,
        requestMethod: req.method,
      }
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
