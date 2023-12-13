const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const dogControllers = require("../../controllers/dogControllers");
const medicineRoutes = require("./medicineRoutes");

//   /dogs

//GET
router.get("/", authMiddleware.decodeJwt, dogControllers.getAllDogs);

router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.getDog
);

//PUT
router.put(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.UpdateDog
);

//POST dog
router.post("/", authMiddleware.decodeJwt, dogControllers.createDog);

//DELETE
router.delete(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogControllers.deleteDog
);

// medicineRoutes
router.use("/medicine", medicineRoutes);

module.exports = router;
