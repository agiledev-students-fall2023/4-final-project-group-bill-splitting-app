const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");

router.post("/", async (req, res) => {
  const { currentUserId, friendUserId } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    const friendUser = await User.findById(friendUserId);

    if (!currentUser || !friendUser) {
      return res.status(404).send("One or both users not found");
    }

    if (!currentUser.friends.includes(friendUserId)) {
      currentUser.friends.push(friendUserId);
      await currentUser.save();
    } else {
      return res.status(200).send("Already friends");
    }

    if (!friendUser.friends.includes(currentUserId)) {
      friendUser.friends.push(currentUserId);
      await friendUser.save();
    }

    res.status(200).send("Friends added successfully");
  } catch (error) {
    console.error("Error in addFriend route:", error);
    res.status(500).send("Error adding friend");
  }
});

module.exports = router;
