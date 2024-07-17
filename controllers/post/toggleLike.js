import Post from "../../models/post.js";
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ post, hasLiked: !hasLiked });
  } catch (error) {
    console.error("Error in toggleLike:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default toggleLike;
