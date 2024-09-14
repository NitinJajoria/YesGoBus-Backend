import express from "express";
const router = express.Router();

import { add_itinerary_plans, customer_sport, edit_booking, get_Itinerary_plans, get_booking, get_customer_booking, make_booking, update_booking_payment } from "../controllers/booking.controller.js";
import {authenticateToken} from "../middleware/cabdriverAuth.js";
import storiesModel from "../modals/travelStories.modal.js"

router.post("/book_hotel",authenticateToken,make_booking);
router.post("/add_itinerary_plans",add_itinerary_plans)
router.post("/itinerary_plans",get_Itinerary_plans )
router.post("/update_booking",edit_booking);
router.post("/update_booking_payment",update_booking_payment)
router.post("/add_booking_query",authenticateToken,customer_sport)
router.get("/get_user_booking", authenticateToken, get_customer_booking)
router.post("/get_booking",  authenticateToken, get_booking)

router.post("/add_stories",async(req,res)=>{
    try{
    const data = await storiesModel.create({
        title:req.body.title,
        image:req.body.image
    })
    return res.status(200).send({
        status: true,
        data: { stories: data },
        message: "packages fetch successfully",
      }); 
    }catch(err){
        return res.status(500).send({
            status: false,
            data: { errorMessage: err.message },
            message: "server error",
          });
    }
})

router.get("/get_stories",async (req,res)=>{
    try{
        const data = await storiesModel.find({},{title:1,image:1})
        return res.status(200).send({
            status: true,
            data: { stories: data },
            message: "Stories fetch successfully",
          }); 
    }catch(err){
        return res.status(500).send({
            status: false,
            data: { errorMessage: err.message },
            message: "server error",
          });
    }
})

export default router;