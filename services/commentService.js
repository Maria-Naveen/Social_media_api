import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

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
    // Find the post by postId and populate comments as subdocuments
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return { success: false, statusCode: 404, message: "Post not found" };
    }

    // Find the comment within the post's comments array by commentId
    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return { success: false, statusCode: 404, message: "Comment not found" };
    }

    // Check if the user has already liked the comment
    const hasLikedIndex = comment.likes.indexOf(userId);

    // Toggle the like status
    if (hasLikedIndex !== -1) {
      comment.likes.splice(hasLikedIndex, 1); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }

    // Save the updated post (though saving only the comment is sufficient here)
    await comment.save();

    // Return success response with updated comment and like status
    return { success: true, comment, hasLiked: hasLikedIndex === -1 };
  } catch (error) {
    console.error("Error in toggleCommentLike service:", error);
    throw new Error("Toggle comment like failed");
  }
};
const updateComment = async (postId, commentId, userId, newText) => {
  try {
    // Check if the comment exists and the user is authorized to update it
    const comment = await Comment.findOne({ _id: commentId, author: userId });

    if (!comment) {
      return {
        success: false,
        statusCode: 404,
        message: "Comment not found or user not authorized",
      };
    }

    // Update the comment
    comment.text = newText;
    await comment.save();

    return { success: true, comment };
  } catch (error) {
    console.error("Error in updateComment service:", error);
    throw new Error("Could not update comment");
  }
};

export default {
  addComment,
  deleteComment,
  updateComment,
  toggleCommentLike,
};
