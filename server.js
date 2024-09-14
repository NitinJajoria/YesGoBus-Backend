import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import http from "http";
import passport from "passport";
import session from "express-session";
import "./utils/passport-setup.js";
//routes
import userRoutes from "./routes/user.routes.js";
import cabRoutes from "./routes/cab.routes.js";
import bookingHistoryRoutes from "./routes/bookingHistory.routes.js";
import cabBookingRoutes from "./routes/cabbooking.routes.js";
import busBookingRoutes from "./routes/busBooking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import kycRoutes from "./routes/verifykyc.routes.js";
import agentRoutes from "./routes/agents.routes.js";
import cabdriverRoute from "./routes/cabdriver.routes.js";
import packagesRoute from "./routes/packages.routes.js";
import bookingRoute from "./routes/booking.routes.js";
import hotelRoute from "./routes/hotel.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import feedbackRoute from "./routes/feedback.routes.js";
import offerRoute from "./routes/offer.routes.js";

//schedular
import {
	sendReminderJob,
	checkPaymentJob,
	sendMessageAfterJourneyJob,
} from "./utils/scheduler.js";

dotenv.config();
const app = express();
const PORT = 8000;

const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("connected to mongodb server");
	} catch (err) {
		console.log(err);
	}
};

//middleware
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://yesgobus.com",
			"https://yesgobus.netlify.app",
			"https://localhost",
			"http://192.168.1.101:5173",
			"http://localhost",
		],
		credentials: true,
	})
);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

// Session setup
app.use(
	session({
		secret: "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",
		resave: false,
		saveUninitialized: false,
	})
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile"],
	})
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		// Successful authentication
		console.log("User:", req.user);
		// res.redirect('/profile');
	}
);

//routes
app.get("/", (req, res) => {
	res.send("YesGoBus Backend");
});
app.use("/api/user", userRoutes);
app.use("/api/cab", cabRoutes);
app.use("/api/bookingHistory", bookingHistoryRoutes);
app.use("/api/cabBooking", cabBookingRoutes);
app.use("/api/busBooking", busBookingRoutes);
app.use("/api/payment/", paymentRoutes);
app.use("/api/cabdriver", cabdriverRoute);
app.use("/api/driver", driverRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/package", packagesRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/coupon", couponRouter);
app.use("/api/feedback", feedbackRoute);
app.use("/api/offers", offerRoute);

const server = http.createServer(app);

// Set maximum headers count, maximum header size, and maximum body size
server.maxHeadersCount = 10000; // Maximum number of headers allowed in a request
server.maxHeaderSize = 1048576; // Maximum size of individual headers in bytes
server.maxBodySize = 52428800; // Maximum size of the request body in bytes

// Start the server
server.listen(PORT, () => {
	connect();
	console.log(`server started on port ${PORT}`);
});
// app.listen(PORT, () => {
//   connect();
//   console.log(`server started on port ${PORT}`);
// });
