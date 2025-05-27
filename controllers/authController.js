const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.changePassword = async (req, res) => {
  try {
    const { nim_nip, oldPassword, newPassword, confirmPassword } = req.body;

    // Cari user berdasarkan nim_nip
    const user = await User.findOne({ nim_nip });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Cek apakah password baru dan konfirmasi cocok
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { nim_nip, password } = req.body;

    // Cari user pakai nim_nip tanpa cek role
    const user = await User.findOne({ nim_nip });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Bandingkan password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
