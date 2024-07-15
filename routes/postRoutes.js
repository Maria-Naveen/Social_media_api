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
import deleteComment from "../controllers/deleteComment.js";
const router = express.Router();

router.post(
  "/posts",
  [
    verifyUser,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  createPost
);

router.patch("/posts/:id", verifyUser, updatePost);
router.delete("/posts/:id", verifyUser, deletePost);
router.post("/posts/:id/comments", verifyUser, addComment);
router.post("/posts/:id/toggle-like", verifyUser, toggleLike);
router.get("/posts/:id/details", verifyUser, getPostDetails);
router.patch("/posts/:postId/comments/:commentId", verifyUser, updateComment);
router.delete("/posts/:postId/comments/:commentId", verifyUser, deleteComment);
export default router;
