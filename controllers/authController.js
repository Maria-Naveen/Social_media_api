import userService from "../services/userService.js";

const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const result = await userService.signup(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  signupController,
  loginController,
};
