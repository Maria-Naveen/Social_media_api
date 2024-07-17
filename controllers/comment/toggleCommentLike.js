import Post from "../../models/post.js";

const toggleCommentLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    //check if the user has already liked the comment
    const hasLiked = comment.likes.includes(userId);
    if (hasLiked) {
      //remove user from likes array(unlike)
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ comment, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default toggleCommentLike;
