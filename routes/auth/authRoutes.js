const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const validation = require("../../middleware/validationMiddleware");

//GET USER profile
router.get("/profile", authMiddleware.decodeJwt, authControllers.getUser);

router.post("/login", authControllers.loginUser);
router.post(
  "/register",
  validation.userRegistrationValidation,
  authControllers.registerUser
);
router.delete("/delete", authMiddleware.decodeJwt, authControllers.deleteUser);

module.exports = router;
