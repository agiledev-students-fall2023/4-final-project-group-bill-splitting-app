const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Event } = require("../models/Event.js");
const { User } = require("../models/User.js");

router.post(
  "/",
  // Validation rules
  body("eventName").notEmpty().withMessage("Event name is required"),
  body("Date").notEmpty().withMessage("Date is required"),
  body("Description").notEmpty().withMessage("Description is required"),
  body("Members").notEmpty().withMessage("Members are required"),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("validation passed");

    try {
      const newEvent = new Event({
        name: req.body.eventName,
        date: req.body.Date,
        description: req.body.Description,
        participants: req.body.Members, // an array of User IDs
        expenses: [], // initialize this as empty
      });

      const savedEvent = await newEvent.save();

      // Fetch and update each participant
      for (const userId of req.body.Members) {
        let user = await User.findById(userId);
        if (!user) {
          console.error(`User not found for ID: ${userId}`);
          continue;
        }

        user.events.push(savedEvent._id); // Add the event ID to the user's events list

        for (const friendId of req.body.Members) {
          if (friendId !== userId && !user.friends.includes(friendId)) {
            user.friends.push(friendId);
          }
        }

        await user.save();
      }

      res.status(201).json({
        status: "Success",
        message: "Event created and added to participants successfully!",
        data: savedEvent,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "Error",
        message: "Error creating event or updating users",
        error: error.message,
      });
    }
  }
);

module.exports = router;
