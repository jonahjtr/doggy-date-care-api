require("dotenv").config();
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const dogControllers = require("../../controllers/dogControllers");

const medicineRoutes = require("./medicineRoutes");
const photoRoutes = require("./photoRoutes");

router.use("/medicine", medicineRoutes);
router.use("/photos", photoRoutes);

// endpoint = /dogs

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
router.post("/", authMiddleware.decodeJwt, dogControllers.createDog);

//delete dog
router.delete(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.deleteDog
);

module.exports = router;
