import express from "express";
import userController from "../controllers/userController.js";
import loginController from "../controllers/loginController.js";
import validateUser from "../middleware/validateUser.js";
import validateSignIn from "../middleware/validateSignIn.js";
const router = express.Router();

router.post("/signup", validateUser, userController);
router.post("/signin", validateSignIn, loginController);

export default router;
