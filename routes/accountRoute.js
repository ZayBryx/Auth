const express = require("express");
const {
  account,
  logout,
  changePassword,
} = require("../controllers/accountControler");
const { authMiddleware, authorizePermissions } = require("../middleware/auth");
const Validator = require("../middleware/Validator");
const { password } = require("../validators");

const router = express.Router();

router.get("/", authMiddleware, authorizePermissions("user"), account);
router.delete("/logout", authMiddleware, authorizePermissions("user"), logout);
router.put(
  "/change-password",
  authMiddleware,
  authorizePermissions("user"),
  Validator(password),
  changePassword
);

module.exports = router;
