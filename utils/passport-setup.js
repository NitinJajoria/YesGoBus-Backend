import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../modals/user.modal.js";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			console.log("Access Token:", accessToken);
			console.log("Refresh Token:", refreshToken);
			console.log("Profile:", profile);

			const existingUser = await User.findOne({ email: profile.email });

			if (existingUser) {
				return done(null, existingUser);
			}

			const newUser = await new User({ email: profile.email }).save();
			done(null, newUser);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});
