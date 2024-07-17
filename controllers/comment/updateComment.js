import Post from "../../models/post.js";

const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findOneAndUpdate(
      { _id: postId, "comments._id": commentId, "comments.author": userId },
      { $set: { "comments.$.text": text } },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post or comment not found or user not authorized" });
    }

    res.status(200).json({ message: "Comment updated", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default updateComment;
