import express from "express";
import verifyUser from "../middleware/auth.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  toggleLike,
} from "../controllers/postControllers.js";
import {
  addComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../controllers/commentControllers.js";
import validateCreatePost from "../middleware/validateCreatePost.js";
import validateUpdatePost from "../middleware/validateUpdatePost.js";
import validateComment from "../middleware/validateComment.js";

const router = express.Router();

// Posts routes
router.post("/posts", [verifyUser, validateCreatePost], createPost);
router.patch("/posts/:id", verifyUser, validateUpdatePost, updatePost);
router.delete("/posts/:id", verifyUser, deletePost);
router.get("/posts/:id", verifyUser, getPostDetails);
router.patch("/posts/:id/toggle-like", verifyUser, toggleLike);

// Comments routes
router.post("/posts/:id/comments", verifyUser, validateComment, addComment);
router.patch(
  "/posts/comments/:postId/:commentId",
  verifyUser,
  validateComment,
  updateComment
);
router.patch(
  "/posts/comments/:postId/:commentId/toggle-like",
  verifyUser,
  toggleCommentLike
);
router.delete("/posts/comments/:postId/:commentId", verifyUser, deleteComment);

export default router;
