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
