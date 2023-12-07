const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");

// Route to get a friend's details by their ID
router.get("/:friendId", async (req, res) => {
  try {
    const friendId = req.params.friendId;
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    res.json(friend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching friend data" });
  }
});

module.exports = router;
