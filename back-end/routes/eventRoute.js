const express = require("express");
const router = express.Router();
const Event = require("../models/Event.js");

router.get("/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId).populate({
      path: "expenses",
      model: "Expense",
      populate: {
        path: "splitDetails.settlement",
        model: "Settlement",
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event data" });
  }
});

module.exports = router;
