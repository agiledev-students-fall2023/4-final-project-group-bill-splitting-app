const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");

router.post("/", async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(401)
      .json({ success: false, message: "No username or password supplied." });
  }

  try {
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      console.error(`User not found.`);
      return res
        .status(401)
        .json({ success: false, message: "User not found in the database." });
    } else if (!user.validPassword(password)) {
      console.error(`Incorrect password.`);
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password." });
    }
    console.log("User logged in successfully.");

    if (user && user.generateJWT) {
      try {
        const token = user.generateJWT();
        res.json({
          success: true,
          message: "User logged in successfully.",
          token: token,
          username: user.username,
        });
      } catch (error) {
        console.error(`Error generating token: ${error}`);
        return res.status(401).json({
          success: false,
          message: "User found but unable to generate token.",
        });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }
  } catch (err) {
    console.error(`Error looking up user: ${err}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in the database.",
      error: err,
    });
  }
});

module.exports = router;
