const jwt = require("jsonwebtoken");
const { UnathenticatedError, BadRequestError } = require("../Errors");

let tokenBlacklist = [];

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    throw new UnathenticatedError("Invalid Token");
  }

  const token = accessToken.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = { userId: payload.userId, role: payload.role };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnathenticatedError("Token is expired");
    }
    throw new UnathenticatedError("Authentication Invalid");
  }
};

module.exports = authMiddleware;
