const Dog = require("../models/dogModels");
const Photo = require("../models/photoModels");
const File = require("../models/fileModels");
const Cal = require("../models/calendarModels");
const { DatabaseError } = require("../utils/errorHandlers/DataBaseErrors");

module.exports.getAllDogs = async (req, res) => {
  try {
    const user_id = req.payload.id;
    const results = await Dog.getAllDogs(user_id);
    const profileUrlsPromises = results.map(async (dog) => {
      const url = await Photo.getPhotoFromS3(dog.profile_picture);
      dog.dog_profile_url = url;
      return url;
    });

    const profileUrls = await Promise.all(profileUrlsPromises);
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      throw new DatabaseError("No dogs found for the user", 404);
    }
  } catch (err) {
    if (err instanceof DatabaseError && err.status === 404) {
      console.error(`${err.name}: ${err.message}`);
      res.status(404).send("No dogs found for the user");
    } else {
      console.error("Error getting dogs:", err);
      res.status(500).send("Internal Server Error fetching dogs");
    }
  }
};

module.exports.getDog = async function (req, res) {
  const dogID = req.params.dogId;
  try {
    console.log("lsdjflkdsj");
    const result = await Dog.getDog(dogID);

    if (!result) {
      // Handle the "Not Found" error (dog not found)
      throw new DatabaseError("Dog not found", 404);
    }
    console.log("result", result);

    const photos = await Photo.getAllPhotosFordog(dogID);
    const files = await File.getAllFilesFordog(dogID);
    const dates = await Cal.getDatesByDogId(dogID);
    console.log("dates", dates);
    if (result.dog_profile_picture) {
      const profile_photo = await Photo.getPhotoFromS3(
        result.dog_profile_picture
      );
      result.dog_profile_picture = profile_photo;
    }

    console.log("first results", result);
    if (photos) result.dog_photos = photos;
    if (files) result.dog_files = files;

    if (dates) result.date_events = dates;
    console.log(" second results", result);
    res.status(200).json(result);
  } catch (error) {
    if (error.status === 404) {
      console.error(`${error.name}: ${error.message}`);
      res.status(error.status).send(error.message);
    } else {
      console.error("Error fetching dog ", error);
      res.status(500).send("Internal Server Error");
    }
  }
};
module.exports.createDog = async function (req, res) {
  const user_id = req.payload.id;
  const dogInfo = req.body.allValues;
  console.log("req.body", req.body.allValues);

  try {
    const result = await Dog.create(user_id, dogInfo);

    if (!result) {
      throw new DatabaseError("Error creating dog", 500);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("Error creating dog", error);

    console.error("Error creating dog", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.UpdateDog = async function (req, res) {
  try {
    const results = await Dog.update(req.params.dogId, req.body.data);

    if (results) {
      res.status(200).json(results);
    } else {
      throw new DatabaseError("no dog found to delete", 404);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(
        `${error.name}: ${error.message}, status code: ${error.status}`
      );
      res.status(error.status).send(error.message);
    } else {
      console.log("Error updating dog", err);
      res.status(500).send("Internal Server Error");
    }
  }
};
module.exports.deleteDog = async function (req, res) {
  const user_id = req.payload.id;
  try {
    const results = await Dog.delete(req.params.dogId, user_id);

    if (results) {
      res.status(200).json(results);
    } else {
      throw new DatabaseError("no dog found to delete", 404);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(
        `${error.name}: ${error.message}, status code: ${error.status}`
      );
      res.status(error.status).send(error.message);
    } else {
      console.log("Error deleting dog", error);
      res.status(500).send("Internal Server Error");
    }
  }
};
