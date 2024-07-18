import postService from "../services/postService.js";

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.body, req.user);
    res.status(201).json({ message: "Post created", post: post });
  } catch (error) {
    next(error);
  }
};
const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params, req.body, req.user);
    res.status(200).json({ message: "Post updated", post: post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params, req.user);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getPostDetails = async (req, res, next) => {
  try {
    const post = await postService.getPostDetails(req.params.id);
    res.status(200).json({ message: "Post details", post: post });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const post = await postService.toggleLike(req.params.postId, req.user.id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost, getPostDetails, toggleLike };
