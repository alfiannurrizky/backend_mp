const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../validators/authValidator");

router.post(
  "/register",
  registerValidationRules(),
  validate,
  authController.register
);
router.post("/login", loginValidationRules(), validate, authController.login);

module.exports = router;
