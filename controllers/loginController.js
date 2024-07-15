import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default loginController;
