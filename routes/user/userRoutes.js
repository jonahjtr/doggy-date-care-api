const express = require("express");
const router = express.Router();
const userControllers = require("../../controllers/userControllers");
const authMiddleware = require("../../middleware/authMiddleware");

// //GET user profile
router.get("/profile", authMiddleware.decodeJwt, userControllers.getUser);

//GET all user files
router.get("/files", authMiddleware.decodeJwt);

//GET all user photos
router.get("/photos", authMiddleware.decodeJwt);

//GET all user medicines
router.get("/medicines", authMiddleware.decodeJwt);

//get all user settings
router.get("/settings", authMiddleware.decodeJwt);

module.exports = router;
