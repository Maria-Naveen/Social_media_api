import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signup = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("User already exists.");
    err.statusCode = 400;
    err.status = "Fail";
    throw err;
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  return { message: "User created successfully!" };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Can't find the user specified.");
    err.statusCode = 400;
    err.status = "Fail";
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const err = new Error("Password is incorrect.");
    err.statusCode = 400;
    err.status = "Fail";
    throw err;
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY, {
    expiresIn: "3h",
  });

  return { token };
};

const getUserDetails = async (userId) => {
  const user = await User.findById(userId).populate("posts");
  if (!user) {
    const err = new Error("User not found!");
    err.statusCode = 400;
    err.status = "Fail";
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
