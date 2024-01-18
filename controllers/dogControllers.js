const Dog = require("../models/dogModels");
const Photo = require("../models/photoModels");
const File = require("../models/fileModels");
const Cal = require("../models/calendarModels");
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

  try {
    const result = await Dog.create(user_id, dogInfo);
    res.status(200).json(result);
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
  try {
    const results = await Dog.delete(req.params.dogId, user_id);
    res.status(200).json(results);
  } catch (error) {
    handleServerError(res, error);
  }
};
