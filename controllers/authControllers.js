const pool = require("../config/db");
const bcrypt = require("bcrypt");
const Auth = require("../models/auth.models");

const registerUser = async (req, res) => {
  Auth.create(req.body)
    .then(function (result) {
      console.log(`user created at ${JSON.stringify(result)} `);
      res.status(200).json(result);
    })
    .catch((err) => err);
};

const getUser = async (req, res) => {
  try {
    const email = req.payload.email;
    const result = await User.findOneByEmail(email);
    if (!result) {
      res.status(401).send("no user found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  Auth.verifyUser(req, res, email, password);
};

const deleteUser = async (req, res) => {
  const data = req.payload;
  Auth.delete(data)
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
  getUser,
};
