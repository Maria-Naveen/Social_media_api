import Post from "../models/post.js";

const createPost = async (postData, user) => {
  try {
    const post = new Post({
      description: postData.description,
      author: user.id,
    });
    await post.save();
    return post;
  } catch (error) {
    const err = new Error("Error creating post");
    err.statusCode = 400;
    err.status = "Fail";
    throw err;
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
      const error = new Error("Post not found");
      error.statusCode = 404;
      error.status = "Fail";
      throw error;
    }
    return post;
  } catch (error) {
    if (error.message === "Post not found") {
      throw error;
    } else {
      throw new Error("Error updating post");
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
      const error = new Error("Post not found");
      error.statusCode = 404;
      error.status = "Fail";
      throw error;
    }
    await Post.deleteOne({ _id: params.id });
  } catch (error) {
    if (error.message === "Post not found") {
      throw error;
    } else {
      throw new Error("Error deleting post");
    }
  }
};

const getPostDetails = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      error.status = "Fail";
      throw error;
    }
    return post;
  } catch (error) {
    if (error.message === "Post not found") {
      throw error;
    } else {
      throw new Error("Error displaying post details");
    }
  }
};

const toggleLike = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      error.status = "Fail";
      throw error;
    }
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return post;
  } catch (error) {
    if (error.message === "Post not found") {
      throw error;
    } else {
      throw new Error("Error toggling like");
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
