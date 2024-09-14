import mongoose from "mongoose";

const storiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Stories = mongoose.model("Stories", storiesSchema);

export default Stories