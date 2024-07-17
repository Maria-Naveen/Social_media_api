import express from "express";
// import userController from "../controllers/userController.js";
// import loginController from "../controllers/loginController.js";
import { userControllers } from "../controllers/index.js";
import validateUser from "../middleware/validateUser.js";
import validateSignIn from "../middleware/validateSignIn.js";
const router = express.Router();

router.post("/signup", validateUser, userControllers.signUpController);
router.post("/signin", validateSignIn, userControllers.loginController);

export default router;
