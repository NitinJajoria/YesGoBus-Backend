import {
	getCityList,
	getAliasesCity,
	searchBus,
	getSeatLayout,
	getBpDpDetails,
	getSeatLayoutV2,
	blockSeat,
	getRTCFareBreakup,
	bookSeat,
	cancelTicketData,
	cancelTicket,
	getTicket,
	checkBookedTicket,
	busCancellationInfo,
	getBusFilters,
	getBusDetails,
	bookBus,
	searchCity,
	updateBookings,
	getBookingById,
	getAllBookings,
	//vrl buses
	sendVrlRequest,
	getVrlFilters,
	getVrlBusDetails,

	//srs buses
	getSrsCities,
	getSrsSchedules,
	getSrsSeatDetails,
	getSrsOperatorSchedules,
	getSrsAvailabilities,
	getSrsAvailability,
	getSrsBlockSeat,
	srsConfirmBooking,
	getSrsBookingDetails,
	getSrsCanCancelDetails,
	srsCancelBooking,
	getSrsFilters,
} from "../service/buBooking.service.js";
import { sendMessage, sendMail } from "../utils/helper.js";

export const getCityListController = async (req, res) => {
	try {
		const response = await getCityList();
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting city list",
			error: error,
		});
	}
};

export const getAliasesCityController = async (req, res) => {
	try {
		const response = await getAliasesCity();
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting aliases city list",
			error: error,
		});
	}
};

export const searchBusController = async (req, res) => {
	try {
		const response = await searchBus(
			req.body.sourceCity,
			req.body.destinationCity,
			req.body.doj
		);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while searching bus details",
			error: error,
		});
	}
};

export const getSeatLayoutController = async (req, res) => {
	try {
		const response = await getSeatLayout(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting seat layout",
			error: error,
		});
	}
};

export const getBpDpDetailsController = async (req, res) => {
	try {
		const response = await getBpDpDetails(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting bpdp details",
			error: error,
		});
	}
};

export const getSeatLayoutV2Controller = async (req, res) => {
	try {
		const response = await getSeatLayoutV2(req.body);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting seat layout v2",
			error: error,
		});
	}
};

export const blockSeatController = async (req, res) => {
	try {
		const response = await blockSeat(req.body);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while blocking seat",
			error: error,
		});
	}
};

export const getRTCFareBreakupController = async (req, res) => {
	try {
		const response = await getRTCFareBreakup(req.params.blockKey);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting rtcfarebreakup details",
			error: error,
		});
	}
};

export const bookSeatController = async (req, res) => {
	try {
		const response = await bookSeat(req.params.blockKey);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while booking seat",
			error: error,
		});
	}
};

export const cancelTicketDataController = async (req, res) => {
	try {
		const response = await cancelTicketData(req.params.tin);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting cancel ticket data",
			error: error,
		});
	}
};

export const cancelTicketController = async (req, res) => {
	try {
		const response = await cancelTicket(req.body);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while cancelling ticket",
			error: error,
		});
	}
};

export const getTicketController = async (req, res) => {
	try {
		const response = await getTicket(req.params.tin);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting ticket data",
			error: error,
		});
	}
};

export const checkBookedTicketController = async (req, res) => {
	try {
		const response = await checkBookedTicket(req.params.blockKey);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while checking booked ticket",
			error: error,
		});
	}
};

export const busCancellationInfoController = async (req, res) => {
	try {
		const response = await busCancellationInfo(req.params.from, req.params.to);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting bus cancellation info",
			error: error,
		});
	}
};

export const getBusFiltersController = async (req, res) => {
	try {
		const response = await getBusFilters(req.query);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting filters",
		});
	}
};

export const getBusDetailsController = async (req, res) => {
	try {
		const searchArgs = {
			sourceCity: req.body.sourceCity,
			destinationCity: req.body.destinationCity,
			doj: req.body.doj,
		};
		let filters = {};
		if (
			req.body.boardingPoints !== null &&
			req.body.boardingPoints?.length > 0
		) {
			filters.boardingPoints = req.body.boardingPoints;
		}
		if (
			req.body.droppingPoints !== null &&
			req.body.droppingPoints?.length > 0
		) {
			filters.droppingPoints = req.body.droppingPoints;
		}
		if (req.body.busPartners !== null && req.body.busPartners?.length > 0) {
			filters.busPartners = req.body.busPartners;
		}
		if (req.body.busTypes !== null && req.body.busTypes?.length > 0) {
			filters.busTypes = req.body.busTypes;
		}
		if (req.body.minPrice !== null && req.body.minPrice !== undefined) {
			filters.minPrice = req.body.minPrice;
		}
		if (req.body.maxPrice !== null && req.body.maxPrice !== undefined) {
			filters.maxPrice = req.body.maxPrice;
		}
		const response = await getBusDetails(searchArgs, filters);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting bus details with filters",
		});
	}
};

export const bookBusController = async (req, res) => {
	try {
		const response = await bookBus(req.body);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while booking bus",
		});
	}
};

export const searchCityController = async (req, res) => {
	try {
		const response = await searchCity(req.params.searchParam);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while searching city",
		});
	}
};

export const updateBookingsController = async (req, res) => {
	try {
		const { bookingId } = req.params;
		const response = await updateBookings(bookingId, req.body);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while updating booking details",
		});
	}
};

export const getBookingByIdController = async (req, res) => {
	try {
		const { bookingId } = req.params;
		const response = await getBookingById(bookingId);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting booking details",
		});
	}
};

export const getAllBookingsController = async (req, res) => {
	try {
		const { userId } = req.params;
		const response = await getAllBookings(userId);
		res.status(response.status).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting booking details",
		});
	}
};

export const sendBookingConfirmationMessage = async (req, res) => {
	try {
		const {
			fullName,
			opPNR,
			doj,
			sourceCity,
			destinationCity,
			seats,
			amount,
			pickUpLocation,
			to,
			contact,
		} = req.body;
		const truncatedPickupLocation =
			pickUpLocation.length > 15
				? pickUpLocation.substring(0, 15) + "..."
				: pickUpLocation;

		const contactNumbers = contact.split(" ");
		const selectedContacts = contactNumbers.slice(0, 2).join(" ");

		const message = `Dear ${fullName} Your PNR: ${opPNR} Journey: ${sourceCity} to  ${destinationCity} Seat: ${seats} Amount Rs.${amount} Date: ${doj} Contact: ${selectedContacts} Pickup: ${truncatedPickupLocation} Is Booked. Thank You, Shine Gobus`;
		const templateId = process.env.BOOKING_CONFIRMATION_TEMPLATE_ID;
		const response = await sendMessage(message, to, templateId);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while sending sms",
		});
	}
};

export const sendBookingConfirmationEmail = async (req, res) => {
	try {
		const {
			fullName,
			opPNR,
			doj,
			sourceCity,
			destinationCity,
			seats,
			amount,
			pickUpLocation,
			to,
			contact,
		} = req.body;
		const message = `Dear ${fullName},
      Your PNR: ${opPNR}
      Journey: ${sourceCity} to  ${destinationCity}
      Contact: ${contact}
      Seat: ${seats}
      Amount Rs.${amount}
      Date: ${doj}
      Email: ${to}
      Pickup: ${pickUpLocation} Is Booked.
      Thank You, Shine Gobus`;
		const subject = "Booking Confirmation";
		await sendMail(to, subject, message);

		//send mail to yesgobus
		const adminMailMessage = `New Bus Booking:
      Name: ${fullName},
      PNR: ${opPNR}
      Contact: ${contact}
      Journey: ${sourceCity} to  ${destinationCity}
      Seat: ${seats}
      Amount Rs.${amount}
      Date: ${doj}
      Email: ${to}
      Pickup: ${pickUpLocation} Is Booked.
      Thank You, Shine Gobus`;
		const adminSubject = "New Bus Booking";
		// await sendMail("yesgobus99@gmail.com", adminSubject, adminMailMessage);
		await sendMail("support@yesgobus.com", adminSubject, adminMailMessage);
		res.status(200).send({
			status: 200,
			message: "Email Sent",
		});
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while sending mail",
		});
	}
};

export const sendCancelTicketMessage = async (req, res) => {
	try {
		const { fullName, opPNR, sourceCity, destinationCity, to } = req.body;
		const message = `Dear ${fullName} Your PNR: ${opPNR} Journey: ${sourceCity} to  ${destinationCity} is Cancelled. Thank You, Shine Gobus`;
		const templateId = process.env.BOOKING_CANCELLATION_TEMPLATE_ID;
		const response = await sendMessage(message, to, templateId);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while sending sms",
		});
	}
};

export const sendCancelTicketEmail = async (req, res) => {
	try {
		const { fullName, opPNR, sourceCity, destinationCity, to } = req.body;
		const messageBody = `Dear ${fullName} 
      Your PNR: ${opPNR} 
      Journey: ${sourceCity} to  ${destinationCity} is Cancelled. 
      Thank You, Shine Gobus`;
		const subject = "Booking Cancelled";
		await sendMail(to, subject, messageBody);

		//send mail to yesgobus
		const adminMessageBody = `Name: ${fullName} 
      PNR: ${opPNR} 
      Journey: ${sourceCity} to  ${destinationCity} is Cancelled. 
      Thank You, Shine Gobus`;
		const adminSubject = "Booking Cancelled";
		await sendMail("yesgobus99@gmail.com", adminSubject, adminMessageBody);

		res.status(200).send({
			status: 200,
			message: "Email Sent",
		});
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while sending mail",
		});
	}
};

//vrl travels buses
export const sendVrlRequestController = async (req, res) => {
	try {
		const url = req.params.url;
		const response = await sendVrlRequest(url, req.body);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

//vrl filters
export const getVrlFiltersController = async (req, res) => {
	try {
		const response = await getVrlFilters(req.body);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting filters",
			error: error,
		});
	}
};

export const getVrlBusDetailsController = async (req, res) => {
	try {
		const searchArgs = {
			sourceCity: req.body.sourceCity,
			destinationCity: req.body.destinationCity,
			doj: req.body.doj,
		};
		let filters = {};
		if (
			req.body.boardingPoints !== null &&
			req.body.boardingPoints?.length > 0
		) {
			filters.boardingPoints = req.body.boardingPoints;
		}
		if (
			req.body.droppingPoints !== null &&
			req.body.droppingPoints?.length > 0
		) {
			filters.droppingPoints = req.body.droppingPoints;
		}
		if (req.body.busPartners !== null && req.body.busPartners?.length > 0) {
			filters.busPartners = req.body.busPartners;
		}
		if (req.body.minPrice !== null && req.body.minPrice !== undefined) {
			filters.minPrice = req.body.minPrice;
		}
		if (req.body.maxPrice !== null && req.body.maxPrice !== undefined) {
			filters.maxPrice = req.body.maxPrice;
		}
		const response = await getVrlBusDetails(searchArgs, filters);
		res.status(response.status).send(response);
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting bus details with filters",
		});
	}
};

//vrl travels buses
export const getSrsCitiesController = async (req, res) => {
	try {
		const response = await getSrsCities();
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsSchedulesController = async (req, res) => {
	try {
		const { origin_id, destination_id, travel_date } = req.params;
		const response = await getSrsSchedules(
			origin_id,
			destination_id,
			travel_date
		);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsSeatDetailsController = async (req, res) => {
	try {
		const { schedule_id } = req.params;
		const response = await getSrsSeatDetails(schedule_id);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsOperatorSchedulesController = async (req, res) => {
	try {
		const { travel_id, travel_date } = req.params;
		const response = await getSrsOperatorSchedules(travel_id, travel_date);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsAvailabilitiesController = async (req, res) => {
	try {
		const { origin_id, destination_id, travel_date } = req.params;
		const response = await getSrsAvailabilities(
			origin_id,
			destination_id,
			travel_date
		);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsAvailabilityController = async (req, res) => {
	try {
		const { schedule_id } = req.params;
		const response = await getSrsAvailability(schedule_id);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsBlockSeatController = async (req, res) => {
	try {
		const { schedule_id } = req.params;
		const response = await getSrsBlockSeat(schedule_id, req.body);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const srsConfirmBookingController = async (req, res) => {
	try {
		const { ticket_number } = req.params;
		const response = await srsConfirmBooking(ticket_number);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsBookingDetailsController = async (req, res) => {
	try {
		const { ticket_number, agent_ref_number } = req.params;
		const response = await getSrsBookingDetails(
			ticket_number,
			agent_ref_number
		);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsCanCancelDetailsController = async (req, res) => {
	try {
		const { ticket_number, seat_numbers } = req.params;
		const response = await getSrsCanCancelDetails(ticket_number, seat_numbers);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const srsCancelBookingController = async (req, res) => {
	try {
		const { ticket_number, seat_numbers } = req.params;
		const response = await srsCancelBooking(ticket_number, seat_numbers);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

export const getSrsFiltersController = async (req, res) => {
	try {
		const response = await getSrsFilters(req.query);
		res.status(200).send(response);
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "An error occurred while getting filters",
		});
	}
};
