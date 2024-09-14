import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const offerSchema = new mongoose.Schema(
  {
    destinationId: {
      type: ObjectId,
      required: true,
      ref: "Destination",
      trim: true,
    },
    destination: {
      type: String,
    },
    image:{
        type:String
    },
    offerFor:{
        type:String,
    },
    validTill:{
        type:String
    },
    offer:{
        type:String
    }
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer