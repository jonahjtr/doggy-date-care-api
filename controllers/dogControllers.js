const Dog = require("../models/dogModels");
const Photo = require("../models/photoModels");
const Meds = require("../models/medicineModel");
const File = require("../models/fileModels");
const Cal = require("../models/calendarModels");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

module.exports.getAllDogs = async (req, res) => {
  try {
    const user_id = req.payload.id;
    const results = await Dog.getAllDogs(user_id);
    const profileUrlsPromises = results.map(async (dog) => {
      try {
        if (dog.profile_picture) {
          const url = await Photo.getPhotoFromS3(dog.profile_picture);
          dog.dog_profile_url = url;
        }
      } catch (error) {
        handleServerError(res, error);
      }
    });
    await Promise.all(profileUrlsPromises);
    res.status(200).json(results);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.getDog = async function (req, res) {
  const dogID = req.params.dogId;
  try {
    const result = await Dog.getDog(dogID);

    const photos = await Photo.getAllPhotosFordog(dogID);
    const files = await File.getAllFilesFordog(dogID);
    const dates = await Cal.getDatesByDogId(dogID);

    if (result.dog_profile_picture && result.dog_profile_picture.length > 0) {
      const profile_photo = await Photo.getPhotoFromS3(
        result.dog_profile_picture
      );
      result.dog_profile_picture = profile_photo;
    }

    if (photos.length > 1) result.dog_photos = photos;
    if (files.length > 1) result.dog_files = files;
    if (dates.length > 1) result.date_events = dates;
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.createDog = async function (req, res) {
  const user_id = req.payload.id;
  const dogInfo = req.body;

  const randomizeImageName = () => crypto.randomBytes(32).toString("hex");
  const photoName = randomizeImageName();

  try {
    const filePath = path.join(__dirname, "../utils/dogSilhouette.jpg");

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);

      // Determine the mimetype based on the file extension
      const mimetype = mime.lookup(filePath);

      if (!mimetype) {
        console.error(`Invalid mimetype for file: ${filePath}`);
        return res.status(400).json({ error: "Invalid file format" });
      }

      // Upload the file to S3 with the determined mimetype
      const s3UploadResult = await Photo.postPhotoToS3(
        photoName + "silhouette",
        { buffer: data, mimetype } // Pass data with mimetype
      );

      dogInfo.dog_profile_picture = photoName + "silhouette";
      const result = await Dog.create(user_id, dogInfo);
      res.status(200).json(result);
    } else {
      // Handle the case when the file does not exist
      console.error(`File does not exist at: ${filePath}`);
      res.status(404).json({ error: "Image file not found" });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
module.exports.UpdateDog = async function (req, res) {
  try {
    const results = await Dog.update(req.params.dogId, req.body.data);
    res.status(200).json(results);
  } catch (error) {
    handleServerError(res, error);
  }
};
module.exports.deleteDog = async function (req, res) {
  const user_id = req.payload.id;
  const dogId = req.params.dogId;
  try {
    //dog photos
    //dog files

    //dog dates
    const deletedDates = await Cal.deleteAllDates(dogId);
    //dog medicines delete
    const deletedMeds = await Meds.deleteAllMedicines(dogId);

    const results = await Dog.delete(dogId, user_id);
    res.status(200).json(results);
  } catch (error) {
    handleServerError(res, error);
  }
};
