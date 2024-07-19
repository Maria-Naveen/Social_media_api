import commentService from "../services/commentService.js";
import catchAsync from "../utils/catchAsync.js";

const addComment = catchAsync(async (req, res) => {
  const { id: postId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  const { post, comment } = await commentService.addComment(
    postId,
    userId,
    text
  );

  res.status(200).json({ message: "Comment added", post, comment });
});

const deleteComment = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;

  const result = await commentService.deleteComment(postId, commentId, userId);

  res.status(200).json({ message: "Comment deleted", post: result.post });
});

const toggleCommentLike = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id; // Assuming you get userId from authentication middleware

  const result = await commentService.toggleCommentLike(
    postId,
    commentId,
    userId
  );
  res.status(200).json({ comment: result.comment, hasLiked: result.hasLiked });
});

const updateComment = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  const result = await commentService.updateComment(
    postId,
    commentId,
    userId,
    text
  );
  res.status(200).json({ message: "Comment updated", comment: result.comment });
});

export { addComment, deleteComment, updateComment, toggleCommentLike };
