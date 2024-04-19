const express = require("express");
const {
  account,
  logout,
  changePassword,
} = require("../controllers/accountControler");
const { authMiddleware, authorizePermissions } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, authorizePermissions("user"), account);
router.delete("/logout", authMiddleware, authorizePermissions("user"), logout);
router.put(
  "/change-password",
  authMiddleware,
  authorizePermissions("user"),
  changePassword
);

module.exports = router;
