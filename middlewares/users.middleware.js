const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../key");

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
