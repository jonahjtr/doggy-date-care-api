require("dotenv").config();
const Photo = require("../models/photoModels");
const crypto = require("crypto");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

module.exports.getPhotosByUserId = async (req, res) => {
  try {
    const user_id = req.payload.id;
    const results = await Photo.getAllPhotosForUser(user_id);
    res.status(200).send(results);
  } catch (error) {
    handleServerError(req, error);
  }
};
module.exports.getPhotosByDogId = async (req, res) => {
  try {
    const dog_id = req.params.dogId;
    const results = await Photo.getAllPhotosFordog(dog_id);
    res.status(200).send(results);
  } catch (error) {
    handleServerError(req, error);
  }
};

module.exports.getPhotoByName = async (req, res) => {
  try {
    const photo_name = req.params.photoName;
    const results = await Photo.getPhotoFromS3(photo_name);
    res.status(200).send(results);
  } catch (error) {
    handleServerError(req, error);
  }
};
module.exports.postProfilePhoto = async (req, res) => {
  const data = req.file;
  const dog_id = req.params.dogId;

  const randomizeImageName = () => crypto.randomBytes(32).toString("hex");

  try {
    const photoName = randomizeImageName();
    const s3UploadResult = await Photo.postPhotoToS3(photoName, data);
    const dbStorage = await Photo.updateProfilePhotoInDB(photoName, dog_id);
    res
      .status(200)
      .json({ message: "Profile photo uploaded successfully", photoName });
  } catch (error) {
    handleServerError(req, error);
  }
};
module.exports.postPhoto = async (req, res) => {
  const data = req.file;
  const user_id = req.payload.id;
  const dog_id = req.params.dogId;
  const randomizeImageName = () => crypto.randomBytes(32).toString("hex");
  try {
    const photoName = randomizeImageName();
    const results = await Photo.postPhotoToS3(photoName, data);
    const dbStorage = await Photo.postPhotoToDB(photoName, user_id, dog_id);
    res.status(200).send("Photo uploaded successfully");
  } catch (error) {
    handleServerError(req, error);
  }
};

module.exports.deletePhoto = async (req, res) => {
  const photoName = req.params.photoName;
  try {
    const result = await Photo.getSpecificPhoto(photoName);
    if (result.length === 0) {
      const error = new Error("No photo found to delete.");
      error.status = 404;
      throw error;
    }

    const deletedPhotoinfo = await Photo.deletePhoto(photoName);

    res.status(200).send(deletedPhotoinfo);
  } catch (error) {
    handleServerError(req, error);
  }
};
