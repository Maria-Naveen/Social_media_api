import express from "express";
import verifyUser from "../middleware/auth.js";
import userDetails from "../controllers/userDetails.js";

const router = express.Router();

router.get("/user", verifyUser, userDetails);

export default router;
