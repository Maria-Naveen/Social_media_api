import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signup = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  return { message: "User created successfully!" };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email or password is incorrect.");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Email or password is incorrect.");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY, {
    expiresIn: "3h",
  });

  return { token };
};

const getUserDetails = async (userId) => {
  const user = await User.findById(userId).populate("posts");
  if (!user) {
    throw new Error("User not found!");
  }

  const userName = user.name;
  const userPosts = user.posts.map((post) => ({
    description: post.description,
    createdAt: post.createdAt,
  }));

  return { name: userName, posts: userPosts };
};

export default {
  signup,
  login,
  getUserDetails,
};
