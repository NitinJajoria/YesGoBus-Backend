import express from "express";
const router = express.Router();

import { add_offer, get_offer } from "../controllers/offer.controllers.js";

router.post("/add_offer", add_offer);
router.get("/get_offers", get_offer)

export default router;