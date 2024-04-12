const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom-error");

class UnathoizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnathoizedError;
