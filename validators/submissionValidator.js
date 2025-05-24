const { body, validationResult } = require("express-validator");

// Rules untuk pengajuan submission
const submissionValidationRules = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Judul tidak boleh kosong")
      .isLength({ min: 5 })
      .withMessage("Judul minimal 5 karakter"),

    body("description")
      .notEmpty()
      .withMessage("Deskripsi tidak boleh kosong")
      .isLength({ min: 10 })
      .withMessage("Deskripsi minimal 10 karakter"),
  ];
};

// Middleware cek hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  submissionValidationRules,
  validate,
};
