import express from "express";
import authController from "../controllers/authController.js";
import validateUser from "../middleware/validateUser.js";
import validateSignIn from "../middleware/validateSignIn.js";
const router = express.Router();

router.post("/signup", validateUser, authController.signupController);
router.post("/signin", validateSignIn, authController.loginController);

export default router;
