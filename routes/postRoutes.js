import express from "express";
import verifyUser from "../middleware/auth.js";
import { check } from "express-validator";
import createPost from "../controllers/createPost.js";
import updatePost from "../controllers/updatePost.js";
import deletePost from "../controllers/deletePost.js";
import addComment from "../controllers/addComment.js";
import toggleLike from "../controllers/toggleLike.js";
import getPostDetails from "../controllers/getPostDetails.js";
import updateComment from "../controllers/updateComment.js";
import toggleCommentLike from "../controllers/toggleCommentLike.js";
import deleteComment from "../controllers/deleteComment.js";
const router = express.Router();

router.post(
  "/posts",
  [
    verifyUser,
    [check("description", "Description is required").not().isEmpty()],
  ],
  createPost
);

router.patch("/posts/:id", verifyUser, updatePost);
router.delete("/posts/:id", verifyUser, deletePost);
router.post("/posts/:id/comments", verifyUser, addComment);
router.patch("/posts/:postId/toggle-like", verifyUser, toggleLike);
router.get("/posts/:id", verifyUser, getPostDetails);
router.patch("/posts/:postId/comments/:commentId", verifyUser, updateComment);
router.patch(
  "/posts/:postId/comments/:commentId/toggle-like",
  verifyUser,
  toggleCommentLike
);
router.delete("/posts/:postId/comments/:commentId", verifyUser, deleteComment);
export default router;
