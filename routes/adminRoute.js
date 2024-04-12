const express = require("express");
const router = express.Router();

const { admin, logout } = require("../controllers/adminController");
const { authMiddleware, authorizePermissions } = require("../middleware/auth");

router.get("/", authMiddleware, authorizePermissions("admin"), admin);
router.delete("/logout", authMiddleware, authorizePermissions("admin"), logout);

module.exports = router;
