const Joi = require("joi");

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().min(6).messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
    "string.min": "Password must be more than 6 characters",
  }),
  newPassword: Joi.string().required().min(6).messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
    "string.min": "Password must be more than 6 characters",
  }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.requred": "Please confirm your password",
      "any.only": "Password do not match",
    }),
});

module.exports = changePasswordSchema;
