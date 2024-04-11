const express = require("express");
const { account, logout } = require("../controllers/accountControler");

const router = express.Router();

router.get("/", account);
router.delete("/logout", logout);

module.exports = router;
