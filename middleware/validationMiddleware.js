module.exports.userRegistrationValidation = async (req, res, next) => {
  const data = req.body;
  console.log(data);
  if (
    !data.username ||
    !data.email ||
    !data.password ||
    !data.first_name ||
    !data.last_name
  ) {
    res.status(400).json({ error: "missing required feilds" });
  } else {
    next();
  }
};
module.exports.DogCreationValidation = async (req, res, next) => {
  const data = req.body;

  if (!data.name || !data.date_of_birth || !data.sex || !data.breed) {
    res.status(400).json({ error: "missing required feilds" });
  } else {
    next();
  }
};
module.exports.MedicineCreationValidator = async (req, res, next) => {
  const data = req.body.medicine;
  console.log(data);
  if (
    !data.medicine_name ||
    !data.medicine_start_date ||
    !data.medicine_end_date ||
    !data.medicine_dosage ||
    !data.medicine_instructions ||
    !data.medicine_frequency ||
    !data.description
  ) {
    res.status(400).json({ error: "missing required feilds" });
  } else {
    next();
  }
};
