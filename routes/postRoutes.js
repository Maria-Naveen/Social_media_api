import express from "express";
import verifyUser from "../middleware/auth.js";
import { postControllers, commentControllers } from "../controllers/index.js";
import validateCreatePost from "../middleware/validateCreatePost.js";
import validateUpdatePost from "../middleware/validateUpdatePost.js";
import validateComment from "../middleware/validateComment.js";
import validateUpdateComment from "../middleware/validateUpdateComment.js";

const router = express.Router();

router.post(
  "/posts",
  [verifyUser, validateCreatePost],
  postControllers.createPost
);

router.patch(
  "/posts/:id",
  verifyUser,
  validateUpdatePost,
  postControllers.updatePost
);

router.delete("/posts/:id", verifyUser, postControllers.deletePost);

router.post(
  "/posts/:id/comments",
  verifyUser,
  validateComment,
  commentControllers.addComment
);

router.patch(
  "/posts/:postId/toggle-like",
  verifyUser,
  postControllers.toggleLike
);

router.get("/posts/:id", verifyUser, postControllers.getPostDetails);

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
