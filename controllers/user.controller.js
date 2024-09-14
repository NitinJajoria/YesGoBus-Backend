import axios from "axios";
import {
	signUp,
	signIn,
	googleSignUp,
	facebookSignUp,
	updateUserProfile,
} from "../service/user.service.js";
import User from "../modals/user.modal.js";
import jwt from "jsonwebtoken";

export const signUpController = async (req, res) => {
	try {
		const result = await signUp(req.body);
		res
			.status(result.status)
			.json({ message: result.message, data: result.data });
	} catch (err) {
		res
			.status(500)
			.json({ message: "An error occurred while registering a user" });
	}
};

export const resend_otp = async (req, res) => {
	try {
		const response = await axios.post(
			"https://auth.otpless.app/auth/otp/v1/resend",
			{
				orderId: req.body.orderId,
			},
			{
				headers: {
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					"Content-Type": "application/json",
				},
			}
		);
		return res.status(200).send({
			status: true,
			data: response.data,
			message: "OTP send Successfully",
		});
	} catch (err) {
		return res.status(500).send({
			status: false,
			data: { errorMessage: err.message },
			message: "server error",
		});
	}
};
export const verify_otp = async (req, res) => {
	try {
		const response = await axios.post(
			"https://auth.otpless.app/auth/otp/v1/verify",
			{
				orderId: req.body.orderId,
				otp: req.body.otp,
				phoneNumber: `91${req.body.mobileNumber}`,
			},
			{
				headers: {
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					"Content-Type": "application/json",
				},
			}
		);
		if (response.data.isOTPVerified) {
			const user = await User.findOne({
				phoneNumber: req.body.mobileNumber,
			});
			if (user) {
				const payload = {
					userId: user._id,
					phoneNumber: req.body.mobileNumber,
				};

				const generatedToken = jwt.sign(payload, process.env.JWT_KEY);
				return res.status(200).send({
					status: 200,
					data: { token: generatedToken, user: user },
					message: "OTP verified",
				});
			}
		}
		return res.status(200).send({
			status: 200,
			data: response.data,
			message: response.data.reason,
		});
	} catch (err) {
		return res.status(500).send({
			status: false,
			data: { errorMessage: err.message },
			message: "server error",
		});
	}
};
export const signInController = async (req, res) => {
	try {
		const { mobileNumber } = req.body;

		const result = await signIn(mobileNumber);
		// if (result.status === 200) {
		//   res.cookie("token", result.token, {
		//     // httpOnly: true,
		//     maxAge: 3600000,
		//   });
		// }

		res.status(result.status).json({
			message: result.message,
			data: result.data,
			//token: result.token,
		});
	} catch (err) {
		res.status(500).json({ message: "An error occurred while signing in" });
	}
};

export const googleSignInController = async (req, res) => {
	try {
		const { jwtToken } = req.body;
		const result = await googleSignUp(jwtToken);
		res.status(result.status).send(result);
	} catch (err) {
		res.status(500).json({ message: "An error occurred while signing in" });
	}
};

export const facebookSignInController = async (req, res) => {
	try {
		const { name, email } = req.body;
		const result = await facebookSignUp({ name, email });
		res.status(result.status).send(result);
	} catch (err) {
		res.status(500).json({ message: "An error occurred while signing in" });
	}
};

export const updateUserProfileController = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await updateUserProfile(userId, req.body);
		res.status(result.status).send(result);
	} catch (err) {
		res.status(500).json({ message: "An error occurred while signing in" });
	}
};
