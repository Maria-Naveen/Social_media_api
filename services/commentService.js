import Comment from "../models/comment.js";
import Post from "../models/post.js";
import { AppError, NotFoundError } from "../utils/customErrors.js";

const addComment = async (postId, userId, text) => {
  const comment = new Comment({ text, author: userId, postId: postId });
  const savedComment = await comment.save();

  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: savedComment._id } },
    { new: true, runValidators: true }
  );

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  return { post, comment: savedComment };
};

const deleteComment = async (postId, commentId, userId) => {
  try {
    const post = await Post.findOne({ _id: postId, author: userId });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Check if the comment exists in the post
    const commentExists = post.comments.includes(commentId);
    if (!commentExists) {
      throw new NotFoundError("Comment not found");
    }

    // Remove the comment from the post
    await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { $pull: { comments: commentId } },
      { new: true }
    );

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      author: userId,
    });

    if (!deletedComment) {
      throw new NotFoundError("Comment not found");
    }

    return { success: true, post };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Error deleting comment", 500);
    }
  }
};

const toggleCommentLike = async (postId, commentId, userId) => {
  try {
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const hasLikedIndex = comment.likes.indexOf(userId);

    if (hasLikedIndex !== -1) {
      comment.likes.splice(hasLikedIndex, 1); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }

    await comment.save();

    return { success: true, comment, hasLiked: hasLikedIndex === -1 };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Toggle comment like failed");
    }
  }
};

const updateComment = async (postId, commentId, userId, text) => {
  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Check if the comment exists and belongs to the user
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, author: userId },
      { $set: { text } },
      { new: true, runValidators: true }
    );

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    return { success: true, comment };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Error updating the comment", 500);
    }
  }
};

export default {
  addComment,
  deleteComment,
  updateComment,
  toggleCommentLike,
};
