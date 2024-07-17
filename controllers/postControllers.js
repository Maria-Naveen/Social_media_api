import postService from "../services/postService.js";

const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body, req.user);
    res.status(201).json({ message: "Post created", post: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params, req.body, req.user);
    res.status(200).json({ message: "Post updated", post: post });
  } catch (error) {
    if (error.message === "Post not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params, req.user);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error.message === "Post not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

const getPostDetails = async (req, res) => {
  try {
    const post = await postService.getPostDetails(req.params.id);
    res.status(200).json({ message: "Post details", post: post });
  } catch (error) {
    if (error.message === "Post not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await postService.toggleLike(req.params.postId, req.user.id);
    res.status(200).json(post);
  } catch (error) {
    if (error.message === "Post not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

export { createPost, updatePost, deletePost, getPostDetails, toggleLike };
