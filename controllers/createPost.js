import { validationResult } from "express-validator";
import Post from "../models/post.js";

const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Invalid Inputs", errors: errors.array() });
  }

  try {
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      author: req.user.id,
    });

    await post.save();

    res.status(201).json({
      id: post._id,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default createPost;
