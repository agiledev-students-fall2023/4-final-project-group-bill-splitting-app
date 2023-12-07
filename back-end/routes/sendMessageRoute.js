const express = require("express");
const router = express.Router();
const { Message } = require("../models/Message.js");

router.post("/", async (req, res) => {
  try {
    const newMessage = new Message({
      message: req.body.message,
      user: req.body.user,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      status: "Success",
      message: "Message sent successfully!",
      data: savedMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "Error",
      message: "Error sending the message",
      error: error.message,
    });
  }
});

module.exports = router;
