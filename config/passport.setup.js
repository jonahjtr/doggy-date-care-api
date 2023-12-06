require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/homepage",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // The 'err' parameter is missing in your code. It should be the first parameter.
      // Also, 'user' is not defined; you should replace it with the actual user object.
      // Assuming 'user' is part of the profile object, you can pass 'null' as the first parameter.
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
