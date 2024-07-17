import Post from "../../models/post.js";

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post deleted" }); // Changed to 200 for including a message
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default deletePost;
