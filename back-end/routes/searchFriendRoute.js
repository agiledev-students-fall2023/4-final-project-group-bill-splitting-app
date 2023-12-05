const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");

router.get("/", async (req, res) => {
  const { username } = req.query;
  try {
    const userData = await User.findOne({
      username: new RegExp("^" + username + "$", "i"),
    }).select("username avatar _id");

    if (!userData) {
      return res.status(404).send("User not found");
    }
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error accessing the database" });
  }
});

module.exports = router;
