const Auth = require("../models/auth.models");
const User = require("../models/userModels");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

const registerUser = async (req, res) => {
  try {
    const user = await Auth.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    handleServerError(res, error);
  }
};
const getUser = async (req, res) => {
  try {
    const userId = req.payload.id;
    const result = await User.getUserInfo(userId);
    if (!result) {
      res.status(404).send("no user found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const verificationResult = await Auth.verifyUser(email, password);

    if (verificationResult.status === 200) {
      res.status(200).json(verificationResult.data);
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  const data = req.payload;
  try {
    const result = await Auth.delete(data);
    if (result.success == true) res.status(200).send("user deleted");
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  getUser,
};
