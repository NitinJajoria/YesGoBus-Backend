import express from "express";
import {
    getCityListController,
    getAliasesCityController,
    searchBusController,
    getSeatLayoutController,
    getBpDpDetailsController,
    getSeatLayoutV2Controller,
    getRTCFareBreakupController,
    blockSeatController,
    bookSeatController,
    cancelTicketDataController,
    cancelTicketController,
    getTicketController,
    checkBookedTicketController,
    busCancellationInfoController,
    bookBusController,
    updateBookingsController,
    getBookingByIdController,
    getAllBookingsController,
    getBusFiltersController,
    getBusDetailsController,
    searchCityController,
    sendBookingConfirmationMessage,
    sendBookingConfirmationEmail,
    sendCancelTicketMessage,
    sendCancelTicketEmail,
    //vrl buses
    sendVrlRequestController,
    getVrlFiltersController,
    getVrlBusDetailsController,

    //srs buses
    getSrsCitiesController,
    getSrsSchedulesController,
    getSrsSeatDetailsController,
    getSrsOperatorSchedulesController,
    getSrsAvailabilitiesController,
    getSrsAvailabilityController,
    getSrsBlockSeatController,
    srsConfirmBookingController,
    getSrsBookingDetailsController,
    getSrsCanCancelDetailsController,
    srsCancelBookingController,
    getSrsFiltersController,

} from "../controllers/busBooking.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

// router.get("/searchCity/:searchParam", searchCityController);
// router.post("/searchBus", searchBusController);
// router.post("/getSeatLayout", getSeatLayoutController);
// router.get("/getFilters", getBusFiltersController);
// router.post("/getBusDetails", getBusDetailsController);

// router.use(authenticateUser);

// //Zuelpay API routes
// router.get("/getCityList", getCityListController);

// router.post("/blockSeat", blockSeatController);
// router.get("/bookSeat/:ticketKey", bookSeatController);
// router.post("/cancelTicket", cancelTicketController);



// //booking routes
// router.post("/bookBus", bookBusController);
// router.patch("/updateBooking/:bookingId", updateBookingsController);
// router.get("/getBookingById/:bookingId", getBookingByIdController);
// router.get("/getAllBookings/:userId", getAllBookingsController);

// //message and email
// router.post("/sendBookingConfirmationMessage", sendBookingConfirmationMessage);
// router.post("/sendCancelTicketMessage", sendCancelTicketMessage);
// router.post("/sendBookingConfirmationEmail", sendBookingConfirmationEmail);
// router.post("/sendCancelTicketEmail", sendCancelTicketEmail);


//search city api
router.get("/searchCity/:searchParam", searchCityController);



// router.use(authenticateUser);

//seatseller apis 

//location routes
router.get("/getCityList", getCityListController);
router.get("/getAliasesCity", getAliasesCityController);

//booking routes
router.post("/searchBus", searchBusController);
router.get("/getSeatLayout/:id", getSeatLayoutController);

// for getting updated fare of gov buses if bpDpSeatLayout is set to true
router.get("/getBpDpDetails/:id", getBpDpDetailsController);
router.post("/getSeatLayoutV2/", getSeatLayoutV2Controller);

// seat hold for 8mins
router.post("/blockSeat", blockSeatController);

// few operators (OSRTC, HRTC, UPSRTC, PEPSU, JKSRTC, VRL and GSRTC) there will be fare change after invoking the blockTicket() method
// if callFareBreakupApi is set to true
router.post("/getrtcfarebreakup", getRTCFareBreakupController);

//confirm and book ticket
router.post("/bookSeat/:blockKey", bookSeatController);

//ticket cancellation routes
router.get("/getCancelTicketData/:tin", cancelTicketDataController);
router.post("/cancelTicket", cancelTicketController);

//ticket information routes
router.get("/getTicket/:tin", getTicketController);
router.get("/checkBookedTicket/:blockKey", checkBookedTicketController);
router.get("/busCancellationInfo/:from/:to", busCancellationInfoController);


// yesgobus APIs

// bookings data
router.post("/bookBus", bookBusController);
router.patch("/updateBooking/:bookingId", updateBookingsController);
router.get("/getBookingById/:bookingId", getBookingByIdController);
router.get("/getAllBookings/:userId", getAllBookingsController);


//get filter and bus with filters
router.get("/getFilters", getBusFiltersController);
router.post("/getBusDetails", getBusDetailsController);


//message and email
router.post("/sendBookingConfirmationMessage", sendBookingConfirmationMessage);
router.post("/sendCancelTicketMessage", sendCancelTicketMessage);
router.post("/sendBookingConfirmationEmail", sendBookingConfirmationEmail);
router.post("/sendCancelTicketEmail", sendCancelTicketEmail);


// VRL travels buses
// https://itsplatform.itspl.net/swagger/index.html - documentation
router.post("/sendVrlRequest/:url", sendVrlRequestController);

router.post("/getVrlFilters", getVrlFiltersController);

router.post("/getVrlBusDetails", getVrlBusDetailsController);

// SRS buses
router.get("/getSrsCities", getSrsCitiesController);
router.get("/getSrsSchedules/:origin_id/:destination_id/:travel_date", getSrsSchedulesController);
router.get("/getSrsSeatDetails/:schedule_id", getSrsSeatDetailsController);
router.get("/getSrsOperatorSchedules/:travel_id/:travel_date", getSrsOperatorSchedulesController);
router.get("/getSrsAvailabilities/:origin_id/:destination_id/:travel_date", getSrsAvailabilitiesController);
router.get("/getSrsAvailability/:schedule_id", getSrsAvailabilityController);
router.post("/getSrsBlockSeat/:schedule_id", getSrsBlockSeatController);
router.post("/srsConfirmBooking/:ticket_number", srsConfirmBookingController);
router.get("/getSrsBookingDetails/:ticket_number/:agent_ref_number", getSrsBookingDetailsController);
router.get("/getSrsCanCancelDetails/:ticket_number/:seat_numbers", getSrsCanCancelDetailsController);
router.get("/srsCancelBooking/:ticket_number/:seat_numbers", srsCancelBookingController);
router.get("/getSrsFilters", getSrsFiltersController);

export default router;
