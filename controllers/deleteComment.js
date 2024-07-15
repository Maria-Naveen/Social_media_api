import Post from "../models/post.js";

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findOneAndUpdate(
      { _id: postId, "comments._id": commentId, "comments.author": userId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post or comment not found or user not authorized" });
    }

    res.status(200).json({ message: "Comment deleted", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default deleteComment;
