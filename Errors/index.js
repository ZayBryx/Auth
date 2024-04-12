const CustomError = require("./custom-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const UnathenticatedError = require("./unathenticated");
const UnathoizedError = require("./unathorized");

module.exports = {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnathenticatedError,
  UnathoizedError,
};
