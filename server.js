require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const cors = require("cors");

const app = express();

// Main app routes
const authRoutes = require("./routes/auth/authRoutes");
const dogRoutes = require("./routes/dog/dogRoutes");
const userRoutes = require("./routes/user/userRoutes");

// Auth-rewrite routes
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const authMiddleware = require("./middlewares/auth.middleware");
const apiUserRoute = require("./api/routes/user.route");

// Error handlers
const { NotFoundError } = require("./utils/errorHandlers/ApplicationHandlers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CookieID));
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// CORS — tighten in production
app.use(cors({ origin: "*" }));

// Main app routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/dogs", dogRoutes);

// Auth-rewrite routes (JWT-based)
app.use("/jwt/auth", authRoute);
app.use("/jwt/users", authMiddleware.checkToken, authMiddleware.protectedRoute, userRoute);
app.use("/jwt/api/users", apiUserRoute);

app.get("/", (req, res) => {
  res.send("Doggy Date Care API");
});

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
