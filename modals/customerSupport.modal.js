import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const customerSupport = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
      trim: true,
    },
    bookingId: {
      type: String
    },
  },
  { timestamps: true }
);

const Support = mongoose.model("Support", customerSupport);

export default Support