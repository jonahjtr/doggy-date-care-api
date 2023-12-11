const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const pool = require("./db");
const { generateUsername } = require("unique-username-generator");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "430030347584-m2al4pjqm2tf2bd7eh89s8ifrb4bc41e.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const { emails } = profile;
        const email = Object.values(emails[0])[0];
        // Check if the user already exists in the database
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        } else {
          const username = generateUsername("-", 2, 20);

          const genericPassword = "temporaryPassword";
          console.log(profile);
          const newUser = await pool.query(
            "INSERT INTO users (username, first_name, last_name, password, email, third_party_login, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
              username,
              profile.name.givenName,
              profile.name.familyName,
              genericPassword,
              email,
              true,
              "user",
            ]
          );

          return done(null, newUser.rows[0]);
        }
      } catch (error) {
        console.error("Authentication failed.", error);
        return done(null, false, { message: "Authentication failed." });
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//     function (request, accessToken, refreshToken, profile, done) {
//       if (profile) {
//         // console.log("auth callback ----->", profile);
//         return done(null, profile);
//       } else {
//         console.error("Authentication failed.");
//         return done(null, false, { message: "Authentication failed." });
//       }
//     }
//   )
// );
