const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  [
    body("email").not().isEmpty().withMessage("Email is required"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("newPassword").not().isEmpty().withMessage("New Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const username = req.body.username;
    const newPassword = req.body.newPassword;
    const email = req.body.email;

    try {
      const user = await User.findOne({
        $and: [{ username: username }, { email: email }],
      });

      if (!user) {
        console.error(`User not found.`);
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      const updatedPassword = user.resetPassword(newPassword);
      await user.save();

      res.json({ success: true, message: "Password updated successfully." });
    } catch (error) {
      console.error(`Error updating password: ${error}`);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

module.exports = router;
