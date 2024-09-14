import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const destinationSchema = new mongoose.Schema(
  {
    hotelId: {
      type: ObjectId,
      required: true,
      ref: "Hotel",
      trim: true,
    },
    plans:[Object],
    checkIn:{
      type:String
    },
    checkOut:{
      type:String
    }
  },
  { timestamps: true }
);

const ItineraryPlans = mongoose.model("ItineraryPlans", destinationSchema);

export default ItineraryPlans