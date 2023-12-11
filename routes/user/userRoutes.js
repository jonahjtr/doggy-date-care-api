const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const userControllers = require("../../controllers/userControllers");

router.get("/homepage", authMiddleware.decodeJwt, (req, res) => {
  if (req.payload.role !== "user") res.status(401).send("unauthorized");
  res.status(200).send("reached homepage");
});
module.exports = router;
