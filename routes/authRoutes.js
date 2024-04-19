const express = require("express");
const router = express.Router();

const {
  login,
  register,
  refresh,
  activateEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");
const Validator = require("../middleware/Validator");
const { account } = require("../validators");

router.post("/register", Validator(account), register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/activate-email", activateEmail);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

module.exports = router;
