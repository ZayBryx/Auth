const express = require("express");
const router = express.Router();

const { login, register, refresh } = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

module.exports = router;
