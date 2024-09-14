import express from "express";
const router = express.Router();

import { add_hotel } from "../controllers/hotel.controller.js";

router.post("/add_hotel",add_hotel);

export default router;