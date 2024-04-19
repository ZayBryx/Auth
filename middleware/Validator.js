const Joi = require("joi");
const { BadRequestError } = require("../Errors");

const Validator = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: true });
    if (error) throw new BadRequestError(error.message);
    req.body = value;
    next();
  };
};

module.exports = Validator;
