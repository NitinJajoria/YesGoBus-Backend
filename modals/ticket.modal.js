import mongoose from "mongoose";

const { Schema } = mongoose;

const inventoryItemsSchema = new Schema({
  fare: Number,
  ladiesSeat: String,
  malesSeat: String,
  operatorServiceCharge: Number,
  seatName: String,
  serviceTax: Number,
  passengers: {
    address: String,
    age: Number,
    email: String,
    gender: String,
    idNumber: String,
    idType: String,
    mobile: Number,
    name: String,
    primary: String,
    title: String,
    singleLadies: String,
  },
});

const ticketSchema = new Schema({
  bookingFee: Number,
  busType: String,
  cancellationPolicy: String,
  dateOfIssue: String,
  destinationCityId: Number,
  doj: String,
  inventoryId: Number,
  dropLocation: String,
  dropLocationAddress: String,
  dropLocationId: Number,
  dropLocationLandmark: String,
  dropTime: Number,
  hasRTCBreakup: String,
  hasSpecialTemplate: String,
  MTicketEnabled: String,
  partialCancellationAllowed: String,
  pickUpContactNo: Number,
  pickUpLocationAddress: String,
  pickUpLocation: String,
  pickUpLocationId: Number,
  pickUpLocationLandmark: String,
  pickUpTime: Number,
  pnr: String,
  primeDepartureTime: Number,
  reschedulingPolicy: [],
  serviceCharge: Number,
  sourceCity: String,
  sourceCityId: Number,
  Status: String,
  tin: String,
  travels: String,
  inventoryItems: [inventoryItemsSchema],
}, {
  timestamps: true,
});

const Tickets = mongoose.model("Tickets", ticketSchema);

export default Tickets;
