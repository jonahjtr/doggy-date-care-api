const jwt = require("jsonwebtoken");
require("dotenv").config();
const Dog = require("../models/dogModels");
const Photo = require("../models/photoModels");
const File = require("../models/fileModels");

module.exports.decodeJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      console.log("Authorization header missing");

      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.replace(/^Bearer\s/, "");
    const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);

    if (!payload) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    req.payload = payload;
    next();
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.verifyDogOwner = async (req, res, next) => {
  try {
    const requesterId = req.payload.id;
    const dogId = req.params.dogId;

    const dogOwnerId = await Dog.getDogOwnerId(dogId);

    if (!requesterId || dogOwnerId !== requesterId) {
      res
        .status(403)
        .json({ message: "Unauthorized access or does not exist" });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error verifying dog owner:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.verifyPhotoOwner = async (req, res, next) => {
  try {
    const requesterId = req.payload.id;
    const photoName = req.params.photoName;
    const photoOwnerId = await Photo.getPhotoOwnerId(photoName);
    if (!requesterId || photoOwnerId !== requesterId) {
      res.status(403).json({
        message: "Unauthorized access to photo or photo does not exist",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error verifying photo owner:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.verifyFileOwner = async (req, res, next) => {
  try {
    const requesterId = req.payload.id;
    const file_name = req.params.fileName;
    console.log(file_name);

    const fileOwnerId = await File.getFileOwnerId(file_name);
    if (!requesterId || fileOwnerId !== requesterId) {
      console.log(requesterId, fileOwnerId);
      res.status(403).json({
        message: "Unauthorized access to file or file does not exist",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error verifying file owner:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//returns req.payload here {
//   username: 'username here',
//   email: 'email here',
//   first_name: 'first name here',
//   last_name: 'last name here',
//   role: 'role of user',
//   iat: 1702314067,
//   exp: 1702918867
// }
