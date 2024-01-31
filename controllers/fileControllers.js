require("dotenv").config();
const crypto = require("crypto");
const File = require("../models/fileModels");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

module.exports.getFilesByUserId = async (req, res) => {
  try {
    const user_id = req.payload.id;
    const results = await File.getAllFilesForUser(user_id);
    res.status(200).send(results);
  } catch (error) {
    handleServerError(res, error);
  }
};
module.exports.getFilesByDogId = async (req, res) => {
  try {
    const dog_id = req.params.dogId;
    const results = await File.getAllFilesFordog(dog_id);
    res.status(200).send(results);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.getFileByName = async (req, res) => {
  try {
    const file_name = req.params.fileName;
    const results = await File.getFileFromS3(file_name);
    res.status(200).send(results);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.postFile = async (req, res) => {
  const data = req.file;
  const user_id = req.payload.id;
  const dog_id = req.params.dogId;
  const file_nickname = req.file.originalname;

  const randomizeFileName = () => crypto.randomBytes(32).toString("hex");
  try {
    const file_name = randomizeFileName();
    const results = await File.postFileToS3(file_name, data);
    const dbStorage = await File.postFileToDB(
      file_name,
      file_nickname,
      user_id,
      dog_id
    );
    res.status(200).send(dbStorage);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.deleteFile = async (req, res) => {
  const file_name = req.params.fileName;
  try {
    const result = await File.getSpecificFile(file_name);
    if (result[0]) {
      const deletedFileName = await File.deleteFile(file_name);
      res.status(200).send(deletedFileName);
    } else {
      console.log("file not found here is result:", result[0]);
      res.status(404).send("No file found for the file name");
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
//sdlkfldksjk
