import mongoose from "mongoose";

const { Schema } = mongoose;

const srsCitySchema = new Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String
    },
    origin_count: {
      type: Number,
    },
    destination_count: {
      type: Number,
    }
  }
);

const SrsCity = mongoose.model("SrsCity", srsCitySchema);

export default SrsCity;
