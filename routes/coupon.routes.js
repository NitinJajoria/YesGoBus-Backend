import express from "express";
const router = express.Router();

import { add_coupon, apply_coupon_discount, get_coupon_code } from "../controllers/coupon.controller.js";
import {authenticateToken} from "../middleware/cabdriverAuth.js";

router.post("/add_coupon",add_coupon);
router.post("/apply_coupon_code",authenticateToken,apply_coupon_discount)
router.get("/get_coupon/:couponFor", get_coupon_code)

export default router