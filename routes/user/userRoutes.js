const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const userControllers = require("../../controllers/userControllers");

//GET DOGS
router.get("/dogs", authMiddleware.decodeJwt, userControllers.getAllDogs);

//GET DOG
router.get(
  "/dogs/:id",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  userControllers.getDog
);

//EDIT
router.post(
  "/dog/:id",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  userControllers.UpdateDog
);

//CREATE
router.post("/dog", authMiddleware.decodeJwt, userControllers.createDog);

//DELETE
router.delete(
  "/dog/:id",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  userControllers.deleteDog
);

module.exports = router;
