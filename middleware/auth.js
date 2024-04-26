const jwt = require("jsonwebtoken");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../Errors");
const Token = require("../models/Token");

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  const refreshToken = req.cookies["jwt"];

  if (!refreshToken) throw new NotFoundError("Token not Found");

  const refresh = await Token.findOne({ refreshToken });

  if (!refresh.isValid) throw new UnathenticatedError("Invalid Token");

  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    throw new UnathenticatedError("Invalid Token");
  }

  const token = accessToken.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnathenticatedError("Token is expired");
    }
    throw new UnathenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnathoizedError("Unauthorized access to this route");
    }
    next();
  };
};

module.exports = { authMiddleware, authorizePermissions };
