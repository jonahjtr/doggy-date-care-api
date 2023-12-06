const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/login",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/login",
  passport.authenticate("google", {
    successRedirect: "/homepage",
    failureRedirect: "/auth/failure",
  })
);

router.get("/logout", (req, res) => {
  // using passport here
  res.status(200).json("hello jonah, this is logout ");
});

module.exports = router;
