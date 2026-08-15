const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../key");

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

module.exports.checkToken = (req, res, next) => {
  try {
    // remember to change to getting from front end
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    jwt.verify(token, secretKey, async (err, payload) => {
      if (payload) {
        req.user = payload;
        if (req.method === "PUT" && req.params.id !== req.user.userId) {
          res
            .status(403)
            .json({ message: "Unauthorized access to update user" });
        } else {
          res.locals.user = payload;
          next();
        }
      } else {
        await tryRefreshToken(req, res, next, refreshToken);
      }
    });
  } catch (err) {
    res.status(401).send("No token provided");
  }
};
async function tryRefreshToken(req, res, next, refreshToken) {
  try {
    jwt.verify(refreshToken, secretKey, (err, payload) => {
      if (payload) {
        const newAccessToken = jwt.sign(
          { userId: payload.userId, email: payload.email, name: payload.name },
          secretKey,
          { expiresIn: "7d" } // this is for a 15 minute idle time
        );

        localStorage.setItem("accessToken", newAccessToken);

        req.user = payload;
        res.locals.user = payload;

        next();
      } else {
        res.redirect("/auth/login");
      }
    });
  } catch (err) {
    res.redirect("/auth/login");
  }
}

module.exports.protectedRoute = (req, res, next) => {
  if (req.user) {
    return next();
  }
};

module.exports.extractUserId = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming "Bearer <token>"

    const payload = await jwt.verify(token, secretKey);

    if (payload.userId) {
      req.userId = payload.userId;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error("Error during token verification:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
