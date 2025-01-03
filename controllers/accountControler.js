const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../Errors");
const Token = require("../models/Token");
const Account = require("../models/Account");
const changePasswordSchema = require("../validators/password.schema");

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

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.user;

  const account = await Account.findById(userId);

  const isMatch = await account.checkPassword(currentPassword);

  if (!isMatch) throw new BadRequestError("Wrong Password");

  account.password = newPassword;
  await account.save();

  res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
};

const updateUser = async (req, res) => {
  const { name } = req.body;
  const { userId } = req.user;

  const account = await Account.findByIdAndUpdate(
    userId,
    { name },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ name: account.name });
};

module.exports = {
  account,
  logout,
  changePassword,
  updateUser,
};
