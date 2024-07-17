import express from "express";
import verifyUser from "../middleware/auth.js";
import userDetailsController from "../controllers/userDetailsController.js";

const router = express.Router();

router.get("/user", verifyUser, userDetailsController);

export default router;
