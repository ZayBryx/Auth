const jwt = require("jsonwebtoken");
const accountSchema = require("../validators/accountSchema");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnathenticatedError,
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
  const { error, value } = accountSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  const { name, email, password } = value;

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

module.exports = {
  login,
  register,
  refresh,
};
