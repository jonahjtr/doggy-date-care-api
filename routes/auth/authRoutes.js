const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authControllers");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/login", authControllers.loginUser);
router.post("/register", authControllers.registerUser);
router.delete("/delete", authMiddleware.decodeJwt, authControllers.deleteUser);
router.delete("/logout", (req, res) => {
  //delete token from local storage
});

module.exports = router;
