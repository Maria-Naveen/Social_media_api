import userService from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";
import { ValidationError } from "../utils/customErrors.js";

const signupController = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ValidationError("All fields are required.");
  }

  const result = await userService.signup(name, email, password);
  res.status(201).json(result);
});

const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("All fields are required.");
  }

  const result = await userService.login(email, password);
  res.status(200).json(result);
});

export default {
  signupController,
  loginController,
};
