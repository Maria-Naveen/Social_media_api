import Post from "../models/post.js";
import Comment from "../models/comment.js";
import { AppError, NotFoundError } from "../utils/customErrors.js";

const createPost = async (postData, user) => {
  try {
    const post = new Post({
      description: postData.description,
      author: user.id,
    });
    await post.save();
    return post;
  } catch (error) {
    throw new AppError("Error creating post");
  }
};

const updatePost = async (params, updateData, user) => {
  try {
    const { id } = params;
    const { description } = updateData;
    const userId = user.id;
    const post = await Post.findOneAndUpdate(
      { _id: id, author: userId },
      { description },
      { new: true, runValidators: true }
    );
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Error updating post");
    }
  }
};

const deletePost = async (params, user) => {
  try {
    const post = await Post.findOne({
      _id: params.id,
      author: user.id,
    });
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    await Comment.deleteMany({ postId: params.id });
    await Post.deleteOne({ _id: params.id });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Error deleting post");
    }
  }
};

const getPostDetails = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Error displaying post details");
    }
  }
};

const toggleLike = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return post;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new AppError("Error toggling like");
    }
  }
};

export default {
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  toggleLike,
};
