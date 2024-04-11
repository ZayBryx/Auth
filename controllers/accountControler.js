const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../Errors");
const Token = require("../models/Token");

const account = async (req, res) => {
  const { name, userId } = req.user;

  res.status(StatusCodes.OK).json({ userId, name });
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

module.exports = {
  account,
  logout,
};
