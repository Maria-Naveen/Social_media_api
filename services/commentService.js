import Comment from "../models/comment.js";
import Post from "../models/post.js";

const addComment = async (postId, userId, text) => {
  const comment = new Comment({ text, author: userId });
  const savedComment = await comment.save();

  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: savedComment._id } },
    { new: true, runValidators: true }
  );

  if (!post) {
    throw new Error("Post not found");
  }

  return { post, comment: savedComment };
};

const deleteComment = async (postId, commentId, userId) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, comments: commentId, author: userId },
      { $pull: { comments: commentId } },
      { new: true }
    );

    if (!post) {
      return {
        success: false,
        statusCode: 404,
        message: "Post or comment not found or user not authorized",
      };
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      author: userId,
    });

    if (!deletedComment) {
      return {
        success: false,
        statusCode: 404,
        message:
          "Comment not found or user not authorized to delete the comment",
      };
    }

    return { success: true, post };
  } catch (error) {
    console.error("Error in deleteComment service:", error);
    return { success: false, statusCode: 500, message: error.message };
  }
};

const toggleCommentLike = async (postId, commentId, userId) => {
  try {
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return { success: false, statusCode: 404, message: "Post not found" };
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return { success: false, statusCode: 404, message: "Comment not found" };
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
    console.error("Error in toggleCommentLike service:", error);
    throw new Error("Toggle comment like failed");
  }
};

const updateComment = async (postId, commentId, userId, text) => {
  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return {
        success: false,
        statusCode: 404,
        message: "Post not found",
      };
    }

    // Check if the comment exists and belongs to the user
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, author: userId },
      { $set: { text } },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return {
        success: false,
        statusCode: 404,
        message: "Comment not found or not authorized",
      };
    }

    return { success: true, comment };
  } catch (error) {
    console.error("Error in updateComment service:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export default {
  addComment,
  deleteComment,
  updateComment,
  toggleCommentLike,
};
