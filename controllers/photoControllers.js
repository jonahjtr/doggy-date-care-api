require("dotenv").config();
const Photo = require("../models/photoModels");
const crypto = require("crypto");

module.exports.getPhotosByUserId = async (req, res) => {
  try {
    const user_id = req.payload.id;
    const results = await Photo.getAllPhotosForUser(user_id);
    if (results) {
      console.log(results);
      res.status(200).send(results);
    } else {
      res.status(404).send("No photos found for the user");
    }
  } catch (err) {
    console.error("Error getting photos:", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getPhotosByDogId = async (req, res) => {
  try {
    const dog_id = req.params.dogId;
    const results = await Photo.getAllPhotosFordog(dog_id);
    if (results) {
      res.status(200).send(results);
    } else {
      res.status(404).send("No photos found for the dog");
    }
  } catch (err) {
    console.error("Error getting photos:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getPhotoByName = async (req, res) => {
  try {
    const photo_name = req.params.photoName;
    const results = await Photo.getPhotoFromS3(photo_name);
    if (results) {
      res.status(200).send(results);
    } else {
      res.status(404).send("No photo found for the photo name");
    }
  } catch (err) {
    console.error("Error getting photos:", err);
    res.status(500).send("Internal Server Error");
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
    if (dbStorage) {
      res.status(200).send(results);
    } else {
      res.status(500).send("not able to post photo ");
    }
  } catch (err) {
    console.error("Error posting photos:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deletePhoto = async (req, res) => {
  const photoName = req.params.photoName;
  try {
    const result = await Photo.getSpecificPhoto(photoName);
    if (result) {
      await Photo.deletePhotoFromS3(photoName);
      const dbDelete = await Photo.deletePhotoFromDB(photoName);
      res.status(200).send(dbDelete);
    } else {
      res
        .status(500)
        .send("not able to delete photo, does not exits, or bad query");
    }
  } catch (err) {
    console.error("Error deleting photo:", err);
    res.status(500).send("Internal Server Error");
  }
};
