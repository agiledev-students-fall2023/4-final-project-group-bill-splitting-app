const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");
const Event = require("../models/Event.js");
const { body, validationResult } = require("express-validator");

router.get("/friendsList/:userId", async (req, res) => {
  try {
    //fetch all data
    const userId = req.params.userId;
    const userWithFriends = await User.findById(userId).populate({
      path: "friends",
      model: "User",
    });
    if (!userWithFriends) {
      return res.status(404).send("User not found");
    }
    res.json(userWithFriends);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
