require("dotenv").config();
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const validation = require("../../middleware/validationMiddleware");
const dogControllers = require("../../controllers/dogControllers");

const calendarRoutes = require("./calendarRoutes");
const medicineRoutes = require("./medicineRoutes");
const photoRoutes = require("./photoRoutes");
const fileRoutes = require("./fileRoutes");
router.use("/medicine", medicineRoutes);
router.use("/photos", photoRoutes);
router.use("/files", fileRoutes);
router.use("/calendar", calendarRoutes);

///dogs

//get all dogs from owner
router.get("/", authMiddleware.decodeJwt, dogControllers.getAllDogs);

//get specific dog
router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.getDog
);

//Edit dog
router.put(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.UpdateDog
);

//create dog
router.post(
  "/",
  authMiddleware.decodeJwt,
  validation.DogCreationValidation,
  dogControllers.createDog
);

//delete dog
router.delete(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.deleteDog
);

module.exports = router;
