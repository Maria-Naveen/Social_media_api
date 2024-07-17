import commentService from "../services/commentService.js";

const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const { post, comment } = await commentService.addComment(
      postId,
      userId,
      text
    );

    res.status(200).json({ message: "Comment added", post, comment });
  } catch (err) {
    if (err.message === "Post not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const result = await commentService.deleteComment(
      postId,
      commentId,
      userId
    );

    if (!result.success) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.status(200).json({ message: "Comment deleted", post: result.post });
  } catch (error) {
    console.error("Error in deleteComment controller:", error);
    res.status(500).json({ message: error.message });
  }
};
const toggleCommentLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id; // Assuming you get userId from authentication middleware

    const result = await commentService.toggleCommentLike(
      postId,
      commentId,
      userId
    );

    if (!result.success) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res
      .status(200)
      .json({ comment: result.comment, hasLiked: result.hasLiked });
  } catch (error) {
    console.error("Error in toggleCommentLike controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    console.log("Request Data:", { postId, commentId, userId, text });

    const result = await commentService.updateComment(
      postId,
      commentId,
      userId,
      text
    );

    if (!result.success) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res
      .status(200)
      .json({ message: "Comment updated", comment: result.comment });
  } catch (error) {
    console.error("Error in updateComment controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addComment, deleteComment, updateComment, toggleCommentLike };
