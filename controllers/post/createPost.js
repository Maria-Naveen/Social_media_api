import Post from "../../models/post.js";

const createPost = async (req, res) => {
  try {
    const post = new Post({
      description: req.body.description,
      author: req.user.id,
    });

    await post.save();

    res.status(201).json({
      id: post._id,
      description: post.description,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default createPost;
