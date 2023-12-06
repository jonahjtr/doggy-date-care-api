const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./auth/authRoutes");
require("./config/passport.setup"); // Include your Passport setup

app.use(
  cors({
    origin: "*",
  })
);

// Session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Your routes setup
app.use("/homepage", (req, res) => {
  res.status(200).send("good job, all logged in");
});
app.use("/", authRoutes);

// ... (other routes and configurations)
module.exports = app;
// Start your server
