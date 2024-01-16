const User = require("../models/userModels");
const Photo = require("../models/photoModels");
const { DatabaseError } = require("../utils/errorHandlers/DataBaseErrors");

const getUser = async (req, res) => {
  try {
    const id = req.payload.id;

    const result = await User.getUserInfo(id);
    if (!result) {
      // Handle the "Not Found" error (no user found)
      console.error(`user not found`);
      res.status(401).send("No user found");
    }

    // Fetch profile photos for each dog in parallel
    let profileUrlsPromises;
    if (result.dogs && result.dogs.length > 0) {
      profileUrlsPromises = result.dogs.map(async (dog) => {
        if (dog.dog_profile_picture) {
          const url = await Photo.getPhotoFromS3(dog.dog_profile_picture);
          dog.dog_profile_url = url;
        }
        return;
      });
    }

    const profileUrls = await Promise.all(profileUrlsPromises);

    // Fetch dates from calendar by user_id here (add your code)

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getUser,
};
