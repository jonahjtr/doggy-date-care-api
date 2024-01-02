const User = require("../models/userModels");
const Photo = require("../models/photoModels");

const getUser = async (req, res) => {
  try {
    const id = req.payload.id;

    const result = await User.getUserInfo(id);

    const profileUrlsPromises = result.dogs.map(async (dog) => {
      const url = await Photo.getPhotoFromS3(dog.dog_profile_picture);
      dog.dog_profile_url = url;
      return url;
    });

    const profileUrls = await Promise.all(profileUrlsPromises);

    //dates here from calendar by user_id

    if (!result) {
      res.status(401).send("no user found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getUser,
};
