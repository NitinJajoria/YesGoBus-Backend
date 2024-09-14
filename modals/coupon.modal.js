import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new mongoose.Schema(
  {
    couponFor:{
      type:String
    },
    title:{
      type:String
    },
    couponDetail:{
      type:String
    },
    image:{
      type:String
    },
    couponCode: {
      type: String,
      unique: true,
    },
    discountValue:{
      type:Number
    },
    validTill:{
      type:String
    }
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", bookingSchema);

export default Coupon