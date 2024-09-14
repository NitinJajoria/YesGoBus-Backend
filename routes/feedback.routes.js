import express from "express";
const router = express.Router();

import { add_feedback, get_feedback } from "../controllers/feedback.controller.js";
import {authenticateToken} from "../middleware/cabdriverAuth.js";

router.post("/add_feedback", authenticateToken, add_feedback);
router.get("/get_feedback", get_feedback)

export default router;