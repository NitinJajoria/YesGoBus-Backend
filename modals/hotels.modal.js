import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const destinationSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
    },
    rating: {
      type: Number,
    },
    image:{
      type:String,

    },
    address: {
      type: String,
    },
    fullAddress: {
      type: String,
    },
    destination:{
      type:String
    }
  },
  { timestamps: true }
);

const Hotels = mongoose.model("Hotels", destinationSchema);

export default Hotels;