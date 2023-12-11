const passport = require("passport");
const LocalStrategy = require("passport-local");
const connection = require("../config/db");

passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyUser(email, password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
