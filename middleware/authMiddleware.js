const jwt = require("jsonwebtoken");
require("dotenv").config();
const Photo = require("../models/photoModels");
const Auth = require("../models/auth.models");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

module.exports.decodeJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
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
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.verifyDogOwner = async (req, res, next) => {
  try {
    const requesterId = req.payload.id;
    const dogId = req.params.dogId;
    const dogOwnerId = await Auth.getDogOwnerId(dogId);
    if (dogOwnerId !== requesterId) {
      res.status(403).json({ message: "Unauthorized access to dog" });
    } else {
      next();
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.verifyPhotoOwner = async (req, res, next) => {
  try {
    const requesterId = req.payload.id;
    const photoName = req.params.photoName;
    const photoOwnerId = await Auth.getPhotoOwnerId(photoName);

    if (!requesterId)
      return res.status(400).json({
        message: "problem finding the userId",
      });
    if (!photoOwnerId)
      res
        .status(404)
        .json({ message: "photo owner is not connected to photo" });
    if (photoOwnerId !== requesterId) {
      res.status(403).json({
        message: "Unauthorized access to photo.",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.verifyFileOwner = async (req, res, next) => {
  try {
    const requesterId = req.payload.id;
    const file_name = req.params.fileName;
    const fileOwnerId = await Auth.getFileOwnerId(file_name);
    if (fileOwnerId !== requesterId) {
      res.status(403).json({
        message: "Unauthorized access to file",
      });
    } else {
      next();
    }
  } catch (error) {
    handleServerError(res, error);
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
