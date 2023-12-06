const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const CLIENT_ID =
  "430030347584-m2al4pjqm2tf2bd7eh89s8ifrb4bc41e.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
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
