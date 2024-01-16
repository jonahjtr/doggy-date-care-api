const Calendar = require("../models/calendarModels");

module.exports.allDates = async function (req, res) {
  const userId = req.payload.id;

  try {
    const dates = await Calendar.getDatesByUser(userId);
    if (dates.length === 0) {
      return res.status(404).json({ message: "No dates found" });
    }
    res.status(200).json({ dates });
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getDatesByDogId = async (req, res) => {
  const dogId = req.params.dogId;

  try {
    const dates = await Calendar.getDatesByDogId(dogId);
    if (dates.length === 0) {
      return res.status(404).json({ message: "No dates found" });
    }
    res.status(200).json({ dates });
  } catch (error) {
    console.error("Error creating dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.createDate = async function (req, res) {
  const dateData = req.body.data;
  const userId = req.payload.id;
  const dogId = req.params.dogId;

  try {
    const createdDate = await Calendar.createByDogAndUserId(
      dateData,
      userId,
      dogId
    );
    res.status(200).json({ createdDate });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.updateDate = async function (req, res) {
  const updateData = req.body.dateInfo;
  const dateId = updateData.dateId;

  try {
    const updateDate = await Calendar.updateDate(updateData, dateId);
    // const updatedMedicine = await Medicine.edit(medicineId, updateData);
    // res.status(200).json({
    //   message: "Medicine updated successfully",
    //   medicine: updatedMedicine,
    // });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteMedicine = async (req, res) => {
  const medicineId = req.params.medId;

  try {
    const deletedMedicine = await Medicine.deleteMedicine(medicineId);
    // res.status(200).json({
    //   message: "Medicine deleted successfully",
    //   medicine: deletedMedicine,
    // });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
