const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const Token = require("../models/Token");

const admin = async (req, res) => {
  const account = await Account.find({ role: "user" }).select(
    "name email role"
  );

  res.status(StatusCodes.OK).json(account);
};

const logout = async (req, res) => {
  const { jwt } = req.cookies;
  const { userId } = req.user;

  if (!jwt) throw new NotFoundError("Invalid Token");

  const token = await Token.findOne({ refreshToken: jwt, userId });

  token.isValid = false;

  res.clearCookie("jwt");
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { admin, logout };
