const { body, validationResult } = require("express-validator");

// Validasi ganti password
const changePasswordValidationRules = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Password lama wajib diisi"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password baru minimal 6 karakter"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("Konfirmasi password tidak cocok"),
  ];
};

// Validasi login (pakai nim_nip)
const loginValidationRules = () => {
  return [
    body("nim_nip").notEmpty().withMessage("NIM/NIP wajib diisi"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ];
};

// Middleware cek hasil validasi (dipakai di changePassword & login)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  changePasswordValidationRules,
  loginValidationRules,
  validate,
};
