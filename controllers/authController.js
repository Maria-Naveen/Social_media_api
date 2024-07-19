import userService from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";

const signupController = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await userService.signup(name, email, password);
  res.status(201).json(result);
});

const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  res.status(200).json(result);
});

export default {
  signupController,
  loginController,
};
