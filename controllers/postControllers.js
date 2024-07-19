import postService from "../services/postService.js";
import catchAsync from "../utils/catchAsync.js";

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user);
  res.status(201).json({ message: "Post created", post: post });
});
const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePost(req.params, req.body, req.user);
  res.status(200).json({ message: "Post updated", post: post });
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params, req.user);
  res.status(200).json({ message: "Post deleted successfully" });
});

const getPostDetails = catchAsync(async (req, res) => {
  const post = await postService.getPostDetails(req.params.id);
  res.status(200).json({ message: "Post details", post: post });
});

const toggleLike = catchAsync(async (req, res) => {
  const post = await postService.toggleLike(req.params.postId, req.user.id);
  res.status(200).json(post);
});
export { createPost, updatePost, deletePost, getPostDetails, toggleLike };
