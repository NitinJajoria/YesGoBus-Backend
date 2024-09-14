import express from "express";

import { getBookingController } from "../controllers/bookingHistory.controller.js";

import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

// router.use(authenticateUser);

router.get("/getBookingHistory/:userId", getBookingController);

export default router;
