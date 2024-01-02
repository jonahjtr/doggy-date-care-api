const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authMiddleware = require("../../middleware/authMiddleware");
const photoControllers = require("../../controllers/photoControllers");

//GET
router.get(
  "/single/:photoName",
  authMiddleware.decodeJwt,
  authMiddleware.verifyPhotoOwner,
  photoControllers.getPhotoByName
);
//get all by dog id
router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  photoControllers.getPhotosByDogId
);
//CREATE
router.post(
  "/:dogId",
  authMiddleware.decodeJwt,
  upload.single("file"),
  photoControllers.postPhoto
);
router.post(
  "/profile/:dogId",
  authMiddleware.decodeJwt,
  upload.single("file"),
  photoControllers.postProfilePhoto
);
//DELETE
router.delete(
  "/:photoName",
  authMiddleware.decodeJwt,
  authMiddleware.verifyPhotoOwner,
  photoControllers.deletePhoto
);

module.exports = router;
