const pool = require("../config/db");
const Medicine = require("../models/medicineModel");

module.exports.getMedicines = async function (req, res) {
  const dogId = req.params.dogId;
  try {
    const medicines = await Medicine.getMedicines(dogId);
    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createMedicines = async (req, res) => {
  const dogId = req.params.dogId;
  const medicinesData = req.body.medicine;

  try {
    const createdMedicines = await Medicine.create(medicinesData, dogId);

    res.status(201).json({
      message: "Medicines created successfully",
      medicines: createdMedicines,
    });
  } catch (error) {
    console.error("Error creating medicines:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editMedicine = async function (req, res) {
  const updateData = req.body.medicine;
  const medicineId = updateData.id;

  try {
    const updatedMedicine = await Medicine.edit(medicineId, updateData);

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteMedicine = async (req, res) => {
  const medicineId = req.params.medId;

  try {
    const deletedMedicine = await Medicine.deleteMedicine(medicineId);

    res.status(200).json({
      message: "Medicine deleted successfully",
      medicine: deletedMedicine,
    });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    if (error.message.includes("not found")) {
      res.status(404).json({ error: "Medicine not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
