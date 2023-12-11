const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.decodeJwt = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.replace(/^Bearer\s/, "");
  const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
  req.payload = payload;
  next();
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
