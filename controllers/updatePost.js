import Post from "../models/post.js";

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    const post = await Post.findOneAndUpdate(
      { _id: id, author: userId },
      { title, description },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or user not authorized" });
    }
    res.status(200).json({ mesage: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default updatePost;
