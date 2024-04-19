const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnathenticatedError,
  UnathoizedError,
} = require("../Errors");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const Account = require("../models/Account");
const Token = require("../models/Token");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email or Password is required");
  }

  const account = await Account.findOne({ email });

  if (!account) {
    throw new NotFoundError(`${email} Not Found`);
  }

  const isVerified = account.verification.isVerified;
  if (!isVerified) {
    throw new UnathoizedError("Account is not verified");
  }

  const isMatch = await account.checkPassword(password);

  if (!isMatch) {
    throw new BadRequestError("Wrong Password");
  }

  const accessToken = await account.generateAccessToken();
  const refreshToken = await account.generateRefreshToken();

  await Token.create({ refreshToken, userId: account._id });
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: "production",
    maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  res.status(StatusCodes.OK).json({ token: accessToken });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isExist = await Account.findOne({ email });

  if (isExist) {
    throw new BadRequestError("Email already exists");
  }

  const account = new Account({ name, email, password });

  const verificationToken = await account.generateVerificationToken();

  await account.save();

  res.status(StatusCodes.OK).json({
    message: "Success! Please check your email to verify account",
  });

  await sendVerificationEmail({
    to: account.email,
    verificationToken,
    userId: account._id,
  });
};

const refresh = async (req, res) => {
  const cookie = req.cookies["jwt"];

  if (!cookie) {
    throw new BadRequestError("Invalid Token");
  }

  try {
    const payload = jwt.verify(cookie, process.env.REFRESH_SECRET);

    const account = await Account.findById(payload.userId);

    if (!account) {
      throw new UnathenticatedError(`Invalid User`);
    }

    const accessToken = await account.generateAccessToken();

    res.status(StatusCodes.OK).json({ token: accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnathenticatedError("Token is expired");
    }
    throw new UnathenticatedError("Authentication Invalid");
  }
};

const activateEmail = async (req, res) => {
  const { token, userId } = req.body;

  const account = await Account.findById(userId);

  if (!account) {
    throw new NotFoundError("User not found");
  }

  if (account.verification.token !== token) {
    throw new UnathenticatedError("Invalid verification token");
  }

  const isExpired = account.isVerificationTokenExpired();

  if (isExpired) {
    throw new UnathenticatedError("Expired verification token");
  }

  account.verification.isVerified = true;
  account.verification.token = null;
  account.verification.expiration = null;
  await account.save();

  res.status(StatusCodes.OK).json({ message: "Email activated successfully" });
};

const forgotPassword = async (req, res) => {
  res.send("forgot Password Route");
};

const resetPassword = async (req, res) => {
  res.send("reset Password Route");
};

module.exports = {
  login,
  register,
  refresh,
  activateEmail,
  forgotPassword,
  resetPassword,
};
