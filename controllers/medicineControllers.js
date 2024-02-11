const Medicine = require("../models/medicineModel");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

module.exports.getMedicines = async function (req, res) {
  const dogId = req.params.dogId;
  try {
    const medicines = await Medicine.getMedicines(dogId);
    res.status(200).json({ medicines });
  } catch (error) {
    handleServerError(res, error);
  }
};
module.exports.getMedicinesByUserId = async function (req, res) {
  const user_id = req.payload.id;

  try {
    const medicines = await Medicine.getMedicinesByUserId(user_id);

    res.status(200).json({ medicines });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.createMedicines = async (req, res) => {
  const dogId = req.params.dogId;
  const medicinesData = req.body.data;
  console.log("medicinesData", medicinesData);
  try {
    const createdMedicines = await Medicine.create(medicinesData, dogId);

    res.status(201).json({
      message: "Medicines created successfully",
      medicines: createdMedicines,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.editMedicine = async function (req, res) {
  const updateData = req.body.medicine;
  const medicineId = updateData.id;

  try {
    const updatedMedicine = await Medicine.edit(medicineId, updateData);

    res.status(200).json(updatedMedicine);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.deleteMedicine = async (req, res) => {
  const medicineId = req.params.medId;

  try {
    const deletedMedicine = await Medicine.deleteMedicine(medicineId);

    res.status(200).json(deletedMedicine);
  } catch (error) {
    handleServerError(res, error);
  }
};
