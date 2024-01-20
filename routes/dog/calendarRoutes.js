const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const calendarControllers = require("../../controllers/calendarControllers");
const validation = require("../../middleware/validationMiddleware");

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

// PUT - edit date
router.put(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  calendarControllers.updateDate
);

//POST - create date
router.post(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  validation.DateCreationValidator,
  calendarControllers.createDate
);

//DELETE - delete date
router.delete(
  "/:dogId/:date_id",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  calendarControllers.deleteDate
);

module.exports = router;
