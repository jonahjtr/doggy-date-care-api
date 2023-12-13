const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const medicineControllers = require("../../controllers/medicineControllers");
const dogMiddleware = require("../../middleware/dogMiddleware");
// dogs/medicine

//GET
router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  medicineControllers.getMedicines
);
//CREATE
router.post(
  "/:dogId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  medicineControllers.createMedicines
);

//PUT
router.put(
  "/:dogId/:medId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogMiddleware.verifyDogMedicine,
  medicineControllers.editMedicine
);

//DELETE
router.delete(
  "/:dogId/:medId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogMiddleware.verifyDogMedicine,
  medicineControllers.deleteMedicine
);

module.exports = router;
