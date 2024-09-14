import mongoose from "mongoose";

const { Schema } = mongoose;

const citySchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    latitude: {
      type: String
    },
    locationType: {
      type: String
    },
    longitude: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    state: {
      type: String
    },
    stateId: {
      type: String
    }
  }
);

const City = mongoose.model("City", citySchema);

export default City;
