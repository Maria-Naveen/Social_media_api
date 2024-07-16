import Joi from "joi";

const userValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "any.required": "Name is required.",
      "string.empty": "Name cannot be empty.",
      "string.pattern.base": "Name must contain alphabets only",
      "string.min": "Name should have a minimum length of {#limit} characters",
      "string.max": "Name should have a maximum length of {#limit} characters.",
    }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "String.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty.",
    "string.min":
      "Password should have a minimum length of {#limit} characters.",
  }),
  posts: Joi.array().items(
    Joi.string().hex().length(24).messages({
      "string.hex": "Post ID must be a valid hexadecimal string.",
      "string.length": "Post ID must be exactly 24 characters long.",
    })
  ),
});

export default userValidationSchema;
