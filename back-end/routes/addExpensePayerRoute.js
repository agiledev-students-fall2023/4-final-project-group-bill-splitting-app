const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");
const Event = require("../models/Event.js");

router.get("/EventMember/:eventId", async (req, res) => {
  try {
    //fetch all data
    const eventId = req.params.eventId;
    console.log("eventId:", eventId);
    const eventMember = await Event.findById(eventId).populate("participants");
    if (!eventMember) {
      return res
        .status(404)
        .json({ message: "Event not found or you don't have access to it" });
    }
    res.json(eventMember.participants);
  } catch (error) {
    console.error("Error fetching event members:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
