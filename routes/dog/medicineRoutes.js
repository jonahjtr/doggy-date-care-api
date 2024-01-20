const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const medicineControllers = require("../../controllers/medicineControllers");
const dogMiddleware = require("../../middleware/dogMiddleware");
const validator = require("../../middleware/validationMiddleware");
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
  validator.MedicineCreationValidator,
  medicineControllers.createMedicines
);

//PUT
router.put(
  "/:dogId/:medId", //dogid is null
  authMiddleware.decodeJwt,
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
