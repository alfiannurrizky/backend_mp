const { body, validationResult } = require("express-validator");

// Validasi register (sudah ada)
const registerValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name wajib diisi"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ];
};

// Validasi login
const loginValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi bro!"),
  ];
};

// Middleware cek hasil validasi (dipakai di register & login)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
