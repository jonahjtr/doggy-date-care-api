const jwt = require("jsonwebtoken");
require("dotenv").config();
const Dog = require("../models/dogModels");

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
    console.error("Error decoding JWT:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.verifyDogOwner = async (req, res, next) => {
  try {
    const requesterEmail = req.payload.email;
    const dogId = req.params.dogId;
    const dogOwnerEmail = await Dog.getDogOwner(dogId);

    if (!dogOwnerEmail || dogOwnerEmail.user_email !== requesterEmail) {
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

//returns req.payload here {
//   username: 'username here',
//   email: 'email here',
//   first_name: 'first name here',
//   last_name: 'last name here',
//   role: 'role of user',
//   iat: 1702314067,
//   exp: 1702918867
// }
