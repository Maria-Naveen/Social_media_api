import express from "express";
import verifyUser from "../middleware/auth.js";
import { userControllers } from "../controllers/index.js";

const router = express.Router();

router.get("/user", verifyUser, userControllers.userDetails);

export default router;
