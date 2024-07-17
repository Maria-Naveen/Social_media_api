import Post from "../../models/post.js";

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = { text, author: userId };

    const postComment = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true, runValidators: true }
    );

    if (!postComment) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Comment added", postComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default addComment;
