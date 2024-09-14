import mongoose from "mongoose";

const { Schema } = mongoose;

// const boardingPointSchema = new Schema({
//   id: String,
//   location: String,
//   time: String,
// });

// const droppingPointSchema = new Schema({
//   id: String,
//   location: String,
//   time: String,
// });

const seatDetailSchema = new mongoose.Schema({
  seat_number: String,
  fare: String,
  title: String,
  name: String,
  age: String,
  sex: String,
  is_primary: Boolean,
  id_card_type: String,
  id_card_number: String,
  id_card_issued_by: String,
});

const contactDetailSchema = new mongoose.Schema({
  mobile_number: String,
  emergency_name: String,
  email: String,
});

const customerCompanyGstSchema = new mongoose.Schema({
  name: String,
  gst_id: String,
  address: String,
});

const bookTicketSchema = new mongoose.Schema({
  seat_details: {
    seat_detail: [seatDetailSchema],
  },
  contact_detail: contactDetailSchema,
});

const srsBlockSeatDetails = new mongoose.Schema({
  book_ticket: bookTicketSchema,
  origin_id: String,
  destination_id: String,
  boarding_at: String,
  drop_of: String,
  no_of_seats: Number,
  travel_date: Date,
  customer_company_gst: customerCompanyGstSchema,
});

const paxDetailsSchema = new mongoose.Schema({
  seatName: String,
  paxName: String,
  mobileNo: String,
  paxAge: Number,
  baseFare: Number,
  gstFare: Number,
  totalFare: Number,
  idProofId: Number,
  idProofDetails: String,
});

const reservationSchema = new mongoose.Schema({
  referenceNumber: String,
  passengerName: String,
  seatNames: String,
  email: String,
  phone: String,
  pickUpID: Number,
  dropID: Number,
  payableAmount: Number,
  totalPassengers: Number,
  verifyCall: String,
  discount: Number,
  seatDetails: String,
  paxDetails: [paxDetailsSchema],
  gstState: Number,
  gstCompanyName: String,
  gstRegNo: String,
  apipnrNo: String,
});


const seatDetailsSchema = new Schema({
  age: String,
  name: String,
  seatNbr: String,
  sex: String,
  fare: Number,
  totalFareWithTaxes: Number,
  ladiesSeat: Boolean,
  lastName: String,
  mobile: String,
  title: String,
  email: String,
  idType: String,
  idNumber: String,
  nameOnId: String,
  primary: Boolean,
  ac: Boolean,
  sleeper: Boolean,
});

const busBookingSchema = new Schema({
  userId: String,
  sourceCity: String,
  destinationCity: String,
  doj: Date,
  tripId: String,
  // boardingPoint: boardingPointSchema,
  // droppingPoint: droppingPointSchema,
  boardingPoint: String,
  droppingPoint: String,
  busOperator: String,
  busType: String,
  selectedSeats: String,
  customerName: String,
  customerLastName: String,
  customerEmail: String,
  customerPhone: String,
  emergencyPhNumber: String,
  blockSeatPaxDetails: [seatDetailsSchema],
  reservationSchema: [reservationSchema],
  inventoryType: Number,
  totalAmount: Number,
  merchantTransactionId: String,
  bookingStatus: {
    type: String,
    default: "pending"
  },
  tin: String,
  buspnr: String,
  opPNR: String,
  totalRefundAmount: String,
  cancelChargesPercentage: String,
  cancellationCharges: String,
  pickUpTime: String,
  reachTime: String,
  cancellationPolicy: String,
  sentBookingRemainer: {
    type: String,
    default: false,
  },
  getJourneyFeedback: {
    type: String,
    default: false,
  },
  blockKey: String,
  isVrl: {
    type: Boolean,
    default: false
  },
  isSrs: {
    type: Boolean,
    default: false
  },
  driverNumber: {
    type: String,
  },
  srsBlockSeatDetails: srsBlockSeatDetails,
  agentCode: {
    type: String,
  }
},
  {
    timestamps: true,
  }
);


const BusBooking = mongoose.model("BusBooking", busBookingSchema);

export default BusBooking;