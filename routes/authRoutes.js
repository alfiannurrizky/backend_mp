const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  changePasswordValidationRules,
  loginValidationRules,
  validate,
} = require("../validators/authValidator");

// Ganti password
router.post(
  "/changepassword",  // diperbaiki dari 'register' menjadi 'changepassword'
  changePasswordValidationRules(),
  validate,
  authController.changePassword
);

// Login pakai nim/nip
router.post("/login", loginValidationRules(), validate, authController.login);

module.exports = router;
