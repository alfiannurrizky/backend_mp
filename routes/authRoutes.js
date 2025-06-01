const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const authController = require("../controllers/authController");
const {
  changePasswordValidationRules,
  loginValidationRules,
  validate,
} = require("../validators/authValidator");

router.post(
  "/changepassword",
  verifyToken,
  changePasswordValidationRules(),
  validate,
  authController.changePassword
);

router.post("/login", loginValidationRules(), validate, authController.login);

module.exports = router;
