import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
    destination: {
        type:String
    },
    image: {
        type:String,
    },
    rating:{
        type:String
    },
    duration: {
        type:String
    },
    startingPrice: {
        type:Number
    },
},
{ timestamps: true })

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;