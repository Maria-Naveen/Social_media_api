import jwt from "jsonwebtoken";
import User from "../models/user.js";

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized entry: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized entry: Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyUser;
