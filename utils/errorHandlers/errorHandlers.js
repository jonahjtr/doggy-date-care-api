module.exports.handleServerError = function (res, error) {
  console.error(error);
  if (error.status) {
    res.status(error.status).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};
