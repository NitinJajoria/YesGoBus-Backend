import { getBookingHistoryByUser } from "../service/bookingHistory.service.js";

export const getBookingController = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await getBookingHistoryByUser(userId);
		res
			.status(result.status)
			.json({ message: result.message, data: result.data });
	} catch (err) {
		res
			.status(500)
			.json({ message: "An error occurred while fetching booking history" });
	}
};
