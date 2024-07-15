import Post from "../models/post.js";

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    // console.log(req.user.name);

    const post = await Post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post liked", post });
  } catch (error) {
    res.staus(500).json({ message: error.message });
  }
};

export default likePost;
