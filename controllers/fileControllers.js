require("dotenv").config();
const crypto = require("crypto");
const File = require("../models/fileModels");

module.exports.getFilesByUserId = async (req, res) => {
  try {
    const user_id = req.payload.id;
    const results = await File.getAllFilesForUser(user_id);
    if (results) {
      console.log(results);
      res.status(200).send(results);
    } else {
      res.status(404).send("No files found for the user");
    }
  } catch (err) {
    console.error("Error getting files:", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getFilesByDogId = async (req, res) => {
  try {
    const dog_id = req.params.dogId;
    const results = await File.getAllFilesFordog(dog_id);
    if (results) {
      res.status(200).send(results);
    } else {
      res.status(404).send("No files found for the dog");
    }
  } catch (err) {
    console.error("Error getting files:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getFileByName = async (req, res) => {
  try {
    const file_name = req.params.fileName;
    const results = await File.getFileFromS3(file_name);
    if (results) {
      res.status(200).send(results);
    } else {
      res.status(404).send("No file found for the file name");
    }
  } catch (err) {
    console.error("Error getting file:", err);
    res.status(500).send("Internal Server Error");
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
    if (dbStorage) {
      res.status(200).send(results);
    } else {
      res.status(500).send("not able to post file ");
    }
  } catch (err) {
    console.error("Error posting file:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteFile = async (req, res) => {
  const file_name = req.params.fileName;
  try {
    const result = await File.getSpecificFile(file_name);
    if (result) {
      await File.deleteFileFromS3(file_name);
      const dbDelete = await File.deleteFileFromDB(file_name);
      res.status(200).send(dbDelete);
    } else {
      res
        .status(500)
        .send("not able to delete file, does not exits, or bad query");
    }
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send("Internal Server Error");
  }
};
