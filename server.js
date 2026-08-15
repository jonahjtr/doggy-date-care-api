require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const app = express();

// ROUTES
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");

// MIDDLESWARES
const authMiddleware = require("./middlewares/auth.middleware");

// API
const apiUserRoute = require("./api/routes/user.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CookieID));
app.use(expressSession(process.env.SESSION_SECRET));
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("hello jonah");
});

// use ROUTES
app.use(
  "/users",
  authMiddleware.checkToken,
  authMiddleware.protectedRoute,
  userRoute
);
// AUTH (login / logout)
app.use("/auth", authRoute);

// USERS ( all info on users)
app.use("/api/users", apiUserRoute);

module.exports = app;
