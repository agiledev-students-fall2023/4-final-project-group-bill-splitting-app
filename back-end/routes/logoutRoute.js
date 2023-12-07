const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.json({
    success: true,
    message:
      "There is actually nothing to do on the server side... you simply need to delete your token from the browser's local storage!",
  });
  next();
});

module.exports = router;
