const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth/authRoutes");
const userRoutes = require("./routes/user/userRoutes");

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());

app.use("/", userRoutes);

app.use("/auth", authRoutes);

module.exports = app;
