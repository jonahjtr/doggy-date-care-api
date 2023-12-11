const pool = require("../config/db"); // Make sure to replace with the correct path
const bcrypt = require("bcrypt");
const User = require("../models/auth.models");

const registerUser = async (req, res) => {
  User.create(req.body)
    .then(function (result) {
      console.log(`user created at ${JSON.stringify(result)} `);
      res.status(200).send(`user created ${JSON.stringify(result)}`);
    })
    .catch((err) => err);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  User.verifyUser(req, res, email, password);
};

const deleteUser = async (req, res) => {
  const data = req.payload;
  User.delete(data)
    .then(function (result) {
      if (result.success == true) res.status(200).send("user deleted");
      res.status(200).send("user not deleted");
      console.log(result);
    })
    .catch((err) => err);
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
};
