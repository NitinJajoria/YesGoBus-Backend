import { Router } from "express";
const router = Router();

import {
  user_signup,
  verify_otp,
  resend_otp,
  user_login,
  send_otp_to_aadhaar,
  verify_aadhaar,
  validate_pan,
  validate_driving_license,
  validate_rc,
  add_bank_detail,
  update_user_detail,
} from "../controllers/cabdriver.controller.js";
import { authenticateToken } from "../middleware/cabdriverAuth.js";

router.post("/signup", user_signup);
router.post("/verify_otp", verify_otp);
router.post("/resend_otp", resend_otp);
router.post("/login", user_login);
router.post("/send_otp_aadhaar", authenticateToken, send_otp_to_aadhaar);
router.post("/verify_aadhaar_otp", authenticateToken, verify_aadhaar);
router.post("/validate_pan", authenticateToken, validate_pan);
router.post(
  "/validate_driving_license",
  authenticateToken,
  validate_driving_license
);
router.post("/validate_rc", authenticateToken, validate_rc);
router.post("/add_bank_detail", authenticateToken, add_bank_detail);
router.post("/update_user_detail", authenticateToken, update_user_detail);

export default router;
