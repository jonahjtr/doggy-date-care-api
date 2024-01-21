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

module.exports.FileUploadValidator = async (req, res, next) => {
  const data = req.file;
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMimeTypes.includes(data.mimetype)) {
    return res.status(400).json({ error: "Incorrect file type" });
  }
  if (!data.originalname) {
    res.status(400).json({ error: "missing required feilds" });
  }
  next();
};

module.exports.DateCreationValidator = async (req, res, next) => {
  const data = req.file;
  if (
    !data.start_date_time ||
    !data.location ||
    !data.description ||
    !data.title
  ) {
    res.status(400).json("missing required feilds");
  } else {
    next();
  }
};
module.exports.ValidatePhoto = async (req, res, next) => {
  const data = req.file;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
    "image/x-icon",
    "image/jp2",
  ];

  if (!allowedMimeTypes.includes(data.mimetype)) {
    res.status(401).json("incorrect file type ");
  } else {
    next();
  }
};
module.exports.ValidatePhoto = async (req, res, next) => {
  const data = req.file;
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"]; // Add more as needed

  if (!allowedMimeTypes.includes(data.mimetype)) {
    console.log("Invalid MIME type:", data.mimetype);
    return res.status(400).json({ error: "Incorrect file type" });
  }

  next();
};
