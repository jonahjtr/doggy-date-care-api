const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authMiddleware = require("../../middleware/authMiddleware");
const fileControllers = require("../../controllers/fileControllers");
const validator = require("../../middleware/validationMiddleware");

//GET
router.get(
  "/single/:fileName",
  authMiddleware.decodeJwt,
  authMiddleware.verifyFileOwner,
  fileControllers.getFileByName
);

//get all by dog id
router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  fileControllers.getFilesByDogId
);

//CREATE
router.post(
  "/:dogId",
  authMiddleware.decodeJwt,
  upload.single("file"),
  validator.FileUploadValidator,
  fileControllers.postFile
);

//DELETE
router.delete(
  "/:fileName",
  authMiddleware.decodeJwt,
  authMiddleware.verifyFileOwner,
  fileControllers.deleteFile
);

module.exports = router;
