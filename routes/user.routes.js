import express from "express";
import {
	signUpController,
	signInController,
	googleSignInController,
	facebookSignInController,
	updateUserProfileController,
	verify_otp,
	resend_otp,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/googleSignIn", googleSignInController);
router.post("/facebookSignIn", facebookSignInController);
router.post("/verify_login_otp", verify_otp);
router.post("/verify_signup_otp", verify_otp);
router.post("/resend_otp", resend_otp);
// router.use(authenticateUser);

router.patch("/updateProfile/:userId", updateUserProfileController);

export default router;
