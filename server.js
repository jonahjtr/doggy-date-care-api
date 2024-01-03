const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth/authRoutes");
const dogRoutes = require("./routes/dog/dogRoutes");
const userRoutes = require("./routes/user/userRoutes");
const { NotFoundError } = require("./utils/errorHandlers/ApplicationHandlers");
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

app.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    // Handle other errors (e.g., internal server errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
