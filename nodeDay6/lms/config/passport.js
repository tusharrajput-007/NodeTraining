require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in DB
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          // Create new user from Google profile
          user = await User.create({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName || "N/A",
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            password: "google-auth",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

// serializeUser - stores the user (user id) in cookies
// deserializeUser - on every subsequent request, passport takes the id from session cookie and fetches the full user from db
