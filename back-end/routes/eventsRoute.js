const express = require("express");
const router = express.Router();
const axios = require("axios");
const { User } = require("../models/User.js");
const { Event } = require("../models/Event.js");

router.get("/for/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user and populate the events
    const userWithEvents = await User.findById(userId).populate({
      path: "events",
      model: "Event",
      populate: {
        path: "expenses",
        model: "Expense",
        populate: {
          path: "splitDetails.settlement",
          model: "Settlement",
        },
      },
    });

    if (!userWithEvents) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's events
    res.json(userWithEvents);
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

module.exports = router;
