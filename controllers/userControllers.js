const User = require("../models/userModels");
const Photo = require("../models/photoModels");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

const getUser = async (req, res) => {
  try {
    const id = req.payload.id;

    const result = await User.getUserInfo(id);

    if (result.dogs && result.dogs.length > 0) {
      for (const dog of result.dogs) {
        if (dog.dog_profile_picture) {
          try {
            const url = await Photo.getPhotoFromS3(dog.dog_profile_picture);
            dog.dog_profile_url = url;
          } catch (error) {
            handleServerError(res, error);
          }
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  getUser,
};
