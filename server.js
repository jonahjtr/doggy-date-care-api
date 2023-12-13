const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth/authRoutes");
const dogRoutes = require("./routes/dog/dogRoutes");
const userRoutes = require("./routes/user/userRoutes");
app.use(express.json());

//get rid of this in prod
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRoutes);

app.use("/user", userRoutes);

app.use("/dogs", dogRoutes);

module.exports = app;
