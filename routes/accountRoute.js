const express = require("express");
const { account, logout } = require("../controllers/accountControler");
const { authMiddleware, authorizePermissions } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, authorizePermissions("user"), account);
router.delete("/logout", authMiddleware, authorizePermissions("user"), logout);

module.exports = router;
