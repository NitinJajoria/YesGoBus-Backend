import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    destinationID: {
      type: ObjectId,
      required: true,
      ref: "Destination",
      trim: true,
    },
    destination: {
      type: String,
    },
    image: {
      type: String,
    },
    duration: {
      type: Number,
    },
    totalDuration: {
      type: String,
    },
    witheFlitePrice: {
      type: Number,
    },
    withoutFlitePrice: {
      type: Number,
    },

    hotelId: {
      type: ObjectId,
      required: true,
      ref: "Hotels",
      trim: true,
    },
  },
  { timestamps: true }
);

const Packages = mongoose.model("Packages", destinationSchema);

export default Packages