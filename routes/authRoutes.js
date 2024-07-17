import express from "express";
import authController from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";
import signInValidationSchema from "../validation/authValidation.js";
import userValidationSchema from "../validation/userValidation.js";
const router = express.Router();

router.post(
  "/signup",
  validateRequest(userValidationSchema),
  authController.signupController
);
router.post(
  "/signin",
  validateRequest(signInValidationSchema),
  authController.loginController
);

export default router;
