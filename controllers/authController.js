import userService from "../services/userService.js";

const signupController = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const result = await userService.signup(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await userService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  signupController,
  loginController,
};
