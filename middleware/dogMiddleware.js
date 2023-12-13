const jwt = require("jsonwebtoken");
require("dotenv").config();
const medicine = require("../models/medicineModel");

module.exports.verifyDogMedicine = async (req, res, next) => {
  const dogId = req.params.dogId;
  const medId = req.params.medId;

  try {
    const medicineList = await medicine.getMedicineIdsByDogId(dogId);

    if (!medicineList.includes(parseInt(medId))) {
      return res.status(401).json({ message: "wrong medicine ID" });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error verifying dog medicine:", error);
    return res.status(401).json({ message: "incorrect medicine id" });
  }
};
