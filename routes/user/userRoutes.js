const express = require("express");
const router = express.Router();
const userControllers = require("../../controllers/userControllers");
const authMiddleware = require("../../middleware/authMiddleware");

// //GET USER profile
router.get("/profile", authMiddleware.decodeJwt, userControllers.getUser);

module.exports = router;
