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
import validateRequest from "../middleware/validateRequest.js";
import {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
} from "../validation/postValidation.js";

const router = express.Router();

// Posts routes
router.post(
  "/posts",
  verifyUser,
  validateRequest(createPostSchema),
  createPost
);
router.patch(
  "/posts/:id",
  verifyUser,
  validateRequest(updatePostSchema),
  updatePost
);
router.delete("/posts/:id", verifyUser, deletePost);
router.get("/posts/:id", verifyUser, getPostDetails);
router.patch("/posts/:postId/toggle-like", verifyUser, toggleLike);

// Comments routes
router.post(
  "/posts/:id/comments",
  verifyUser,
  validateRequest(createCommentSchema),
  addComment
);
router.patch(
  "/posts/comments/:postId/:commentId",
  verifyUser,
  validateRequest(updateCommentSchema),
  updateComment
);
router.patch(
  "/posts/comments/:postId/:commentId/toggle-like",
  verifyUser,
  toggleCommentLike
);
router.delete("/posts/comments/:postId/:commentId", verifyUser, deleteComment);

export default router;
