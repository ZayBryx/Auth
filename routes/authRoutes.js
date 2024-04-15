const express = require("express");
const router = express.Router();

const {
  login,
  register,
  refresh,
  activateEmail,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/activate-email", activateEmail);

module.exports = router;
