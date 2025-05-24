const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token tidak ditemukan atau tidak valid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // menyimpan payload token (userId, role, dll)
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kadaluarsa" });
  }
};
