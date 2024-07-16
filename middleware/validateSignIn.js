import signInValidationSchema from "../validation/authValidation.js";

const validateSignIn = (req, res, next) => {
  const { error } = signInValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default validateSignIn;
