const express = require("express");
const controller = require("../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

// GET
router.get("/", authMiddleware.extractUserId, controller.getUsers); // remember to delete before prod
router.get("/single", authMiddleware.extractUserId, controller.getUserById);

// POST
router.post("/create", controller.createUser);

// PUT
router.put("/edit", authMiddleware.extractUserId, controller.updateUser);

// DELETE
router.delete("/delete", authMiddleware.extractUserId, controller.deleteUser);

module.exports = router;
