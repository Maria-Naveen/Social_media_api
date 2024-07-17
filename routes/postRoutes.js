import express from "express";
import verifyUser from "../middleware/auth.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  toggleLike,
} from "../controllers/postControllers.js";
import { commentControllers } from "../controllers/index.js";
import validateCreatePost from "../middleware/validateCreatePost.js";
import validateUpdatePost from "../middleware/validateUpdatePost.js";
import validateComment from "../middleware/validateComment.js";
import validateUpdateComment from "../middleware/validateUpdateComment.js";

const router = express.Router();

router.post("/posts", [verifyUser, validateCreatePost], createPost);

router.patch("/posts/:id", verifyUser, validateUpdatePost, updatePost);

router.delete("/posts/:id", verifyUser, deletePost);

router.post(
  "/posts/:id/comments",
  verifyUser,
  validateComment,
  commentControllers.addComment
);

router.patch("/posts/:postId/toggle-like", verifyUser, toggleLike);

router.get("/posts/:id", verifyUser, getPostDetails);

router.patch(
  "/posts/comments/:postId/:commentId",
  verifyUser,
  validateUpdateComment,
  commentControllers.updateComment
);

router.patch(
  "/posts/:postId/comments/:commentId/toggle-like",
  verifyUser,
  commentControllers.toggleCommentLike
);

router.delete(
  "/posts/:postId/comments/:commentId",
  verifyUser,
  commentControllers.deleteComment
);

export default router;
