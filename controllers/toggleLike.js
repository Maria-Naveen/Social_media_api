import Post from "../models/post.js";

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // Remove the user from the likes array (unlike)
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Add the user to the likes array (like)
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ post, hasLiked: !hasLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default likePost;
