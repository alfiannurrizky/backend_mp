const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const authController = require("../controllers/authController");

router.get("/me", verifyToken, authController.me);

module.exports = router;
