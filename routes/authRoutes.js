import express from "express";
import userController from "../controllers/userController.js";
import loginController from "../controllers/loginController.js";
const router = express.Router();

router.post("/signup", userController);
router.post("/signin", loginController);

export default router;
