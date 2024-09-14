import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		userId: {
			type: Number,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			// required: true
		},
		gender: {
			type: String,
		},
		password: {
			type: String,
			//required: true
		},
		isAgent: {
			type: Boolean,
		},
		bookingHistory: [
			{
				cabBookingId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "CabBooking",
					required: true,
				},
				travellerName: {
					type: String,
					required: true,
				},
				travellerAge: {
					type: Number,
					required: true,
				},
				travellerGender: {
					type: String,
					// required: true
				},
				travellerEmail: {
					type: String,
					required: true,
				},
				travellerPhoneNumber: {
					type: String,
					required: true,
				},
				pickupLocation: {
					type: String,
					required: true,
				},
				dropoffLocation: {
					type: String,
					required: true,
				},
				pickupDateTime: {
					type: Date,
					required: true,
				},
				totalAmount: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
