const pool = require("../config/db"); // Make sure to replace with the correct path
const User = require("../models/userModels");

const getUser = async (req, res) => {
  try {
    const email = req.payload.email;
    const result = await User.getUserAndDogs(email);
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
