import mongoose from "mongoose";

const { Schema } = mongoose;

const vrlcitySchema = new Schema(
  {
    CityID: {
      type: String,
    },
    CityName: {
      type: String
    }
  }
);

const VrlCity = mongoose.model("VrlCity", vrlcitySchema);

export default VrlCity;
