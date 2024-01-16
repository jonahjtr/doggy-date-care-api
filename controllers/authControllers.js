const Auth = require("../models/auth.models");
const Dog = require("../models/dogModels");

const registerUser = async (req, res) => {
  try {
    const result = await Auth.create(req, res);
    if (typeof result === "object" && result !== null) {
      res.status(200).json(result); // Sending success response
    } else if (result === "username already exists") {
      res.status(400).json({ error: result }); // Sending error response
    } else {
      // Handle other error cases
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    if (error.status) {
      res.status(error.status).json({ error: error.error }); // Sending specific error response
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const email = req.payload.email;
    const result = await User.findOneByEmail(email);
    if (!result) {
      res.status(404).send("no user found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).send(error);
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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
