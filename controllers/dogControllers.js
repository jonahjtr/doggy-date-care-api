const pool = require("../config/db"); // Make sure to replace with the correct path
const bcrypt = require("bcrypt");
const Dog = require("../models/dogModels");

module.exports.getAllDogs = async (req, res) => {
  try {
    const email = req.payload.email;
    const results = await Dog.getAllDogs(email);

    if (results) {
      console.log(results);
      res.status(200).send(results);
    } else {
      res.status(404).send("No dogs found for the user");
    }
  } catch (err) {
    console.error("Error getting dogs:", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getDog = async function (req, res) {
  const dogID = req.params.dogId;
  try {
    const result = await Dog.getDog(dogID);
    if (!result) {
      res.status(401).send("error finding dog");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("Error fetching dog ", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.createDog = async function (req, res) {
  try {
    const result = await Dog.create(req.payload.email, req.body.data);
    if (!result) {
      res.status(401).send("error creating dog");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("Error creating dog", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.UpdateDog = async function (req, res) {
  try {
    const results = await Dog.update(req.params.dogId, req.body.data);

    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).send("No dogs found for the user");
    }
  } catch (err) {
    console.log("Error updating dog", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.deleteDog = async function (req, res) {
  try {
    const results = await Dog.delete(req.params.dogId, req.payload.email);

    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).send("No dogs found to delete");
    }
  } catch (err) {
    console.log("Error deleting dog", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getMedicine = async function (req, res) {
  const dogId = req.params.dogId;
  try {
    const medicines = await Dog.getMedicines(dogId);
    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.createMedicines = async (req, res) => {
  console.log(req.body);
  try {
    const medicinesData = req.body.medicine;
    const createdMedicines = await Dog.createMedicines(medicinesData);

    res.status(201).json({
      message: "Medicines created successfully",
      medicines: createdMedicines,
    });
  } catch (error) {
    console.error("Error creating medicines:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
