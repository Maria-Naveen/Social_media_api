import Post from "../models/post.js";

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post unliked", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default unlikePost;
