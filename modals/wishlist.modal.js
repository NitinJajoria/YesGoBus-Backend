import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User",
        trim: true,
      },
      packageId: {
        type: ObjectId,
        require: true,
        ref: "Packages",
        trim: true,
      },
      isWishlisted:{
        type:Boolean,
        default:true
      }
}, { timestamps: true });


const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist