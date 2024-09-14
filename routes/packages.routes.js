import express from "express";
const router = express.Router();

import {
  add_destination,
  add_packages,
  add_to_wishlist,
  get_packages,
  get_user_wishlist,
  popular_destinations,
} from "../controllers/packages.controller.js";
import {authenticateToken} from "../middleware/cabdriverAuth.js";

router.post("/add_destinations", add_destination);
router.post("/add_packages", add_packages);
router.get("/get_destinations", get_packages);
router.post("/packages", authenticateToken, popular_destinations);
router.post("/add_to_wishlist", authenticateToken, add_to_wishlist);
router.get(
  "/get_user_wishlist",
  authenticateToken,
  get_user_wishlist
);

export default router;
