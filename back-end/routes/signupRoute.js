const express = require("express");
const router = express.Router();
const { User } = require("../models/User.js");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  [
    body("email").not().isEmpty().withMessage("Email is required"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const avatar = `${process.env.AVATAR_GENERATOR}/${username}.png?size=50x50&set=set1`;

    if (!username || !password || !email) {
      res.status(401).json({
        success: false,
        message: `No username, password, or email are supplied.`,
      });
      next();
    }

    try {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "Username or email already exists.",
        });
        next();
        return;
      }

      const user = await new User({ username, password, email, avatar }).save();
      console.error(`New user: ${user}`);
      const token = user.generateJWT();
      res.json({
        success: true,
        message: "User saved successfully.",
        token: token,
        username: user.username,
      });
      next();
    } catch (err) {
      console.error(`Failed to save user: ${err}`);
      res.status(500).json({
        success: false,
        message: "Error saving user to database.",
        error: err,
      });
      next();
    }
  }
);

module.exports = router;
