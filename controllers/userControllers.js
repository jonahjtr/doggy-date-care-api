const pool = require("../config/db"); // Make sure to replace with the correct path
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
module.exports.getAllDogs = async (req, res) => {
  try {
    const email = req.payload.email;
    const results = await User.getAllDogs(email);

    if (results) {
      res.status(200).send(results);
    } else {
      res.status(404).send("No dogs found for the user");
    }
  } catch (err) {
    console.error("Error getting dogs:", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getDog = async function (req, res) {
  const dogID = req.params.id;
  try {
    const result = await User.getDog(dogID);
    if (!result) {
      res.status(401).send("error finding dog");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("Error fetching dog dog", error);
    res.status(500).send("Internal Server Error");
  }
  // find dog and return info on dog
};
module.exports.createDog = async function (req, res) {
  try {
    const result = await User.create(req.payload.email, req.body.data);
    if (!result) {
      res.status(401).send("error creating dog");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("Error creating dog", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.UpdateDog = async function (req, res) {
  try {
    const results = await User.update(req.params.id, req.body.data);

    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).send("No dogs found for the user");
    }
  } catch (err) {
    console.log("Error updating dog", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.deleteDog = async function (req, res) {
  try {
    const results = await User.delete(req.params.id, req.payload.email);

    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).send("No dogs found to delete");
    }
  } catch (err) {
    console.log("Error deleting dog", err);
    res.status(500).send("Internal Server Error");
  }
};
