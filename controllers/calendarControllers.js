const Calendar = require("../models/calendarModels");
const { handleServerError } = require("../utils/errorHandlers/errorHandlers");

module.exports.allDates = async function (req, res) {
  const userId = req.payload.id;

  try {
    const dates = await Calendar.getDatesByUser(userId);
    if (dates.length === 0) {
      return res.status(404).json({ message: "No dates found" });
    }
    res.status(200).json({ dates });
  } catch (error) {
    handleServerError(res, error);
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
    handleServerError(res, error);
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
    handleServerError(res, error);
  }
};
module.exports.updateDate = async function (req, res) {
  const updateData = req.body.dateInfo;
  const dateId = updateData.date_id;
  try {
    const updateDate = await Calendar.editDate(updateData, dateId);
    res.status(200).json({ updateDate });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports.deleteDate = async (req, res) => {
  const date_id = req.params.date_id;
  try {
    const deletedDate = await Calendar.deleteDate(date_id);
    res.status(200).json({ deletedDate });
  } catch (error) {
    handleServerError(res, error);
  }
};
