const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const medicineControllers = require("../../controllers/medicineControllers");
const dogMiddleware = require("../../middleware/dogMiddleware");
const calendarControllers = require("../../controllers/calendarControllers");

// dogs/calendar

//GET - get all calendar dates
router.get("/", authMiddleware.decodeJwt, calendarControllers.allDates);
//get dates by dog
router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  calendarControllers.getDatesByDogId
);

//PUT - edit date
// router.put("/:dogId", authMiddleware.decodeJwt, authMiddleware.verifyDogOwner);

//POST - create date
router.post(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  calendarControllers.createDate
);

//DELETE - delete date
router.delete(
  "/:dogId/:dateId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner
);

module.exports = router;
