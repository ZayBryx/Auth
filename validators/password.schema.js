const Joi = require("joi");

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().min(6).messages({
    "string.empty": "Current Password is required",
    "any.required": "Current Password is required",
    "string.min": "Password must be more than 6 characters",
  }),
  newPassword: Joi.string().required().min(6).messages({
    "string.empty": "New Password is required",
    "any.required": "New Password is required",
    "string.min": "Password must be more than 6 characters",
  }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.required": "Please confirm your password",
      "any.only": "Password do not match",
    }),
});

module.exports = changePasswordSchema;
