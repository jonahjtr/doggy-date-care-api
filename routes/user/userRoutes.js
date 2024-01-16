const express = require("express");
const router = express.Router();
const userControllers = require("../../controllers/userControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const PhotoController = require("../../controllers/photoControllers");
const medicineControllers = require("../../controllers/medicineControllers");
const calendarControllers = require("../../controllers/calendarControllers");
const fileControllers = require("../../controllers/fileControllers");

// //GET user profile
router.get("/profile", authMiddleware.decodeJwt, userControllers.getUser);

//GET all user files
router.get(
  "/files",
  authMiddleware.decodeJwt,
  fileControllers.getFilesByUserId
);

//GET all user photos
router.get(
  "/photos",
  authMiddleware.decodeJwt,
  PhotoController.getPhotosByUserId
);

//GET all user medicines
router.get(
  "/medicines",
  authMiddleware.decodeJwt,
  medicineControllers.getMedicinesByUserId
);
router.get("/dates", authMiddleware.decodeJwt, calendarControllers.allDates);
//get all user settings
router.get("/settings", authMiddleware.decodeJwt);

module.exports = router;
