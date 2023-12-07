const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Settlement } = require("../models/Settlement.js");

router.post("/:settlementId", async (req, res) => {
  try {
    const status = req.body.status;
    const settlementId = req.params.settlementId;

    if (settlementId === "all") {
      const settlementIds = req.body.settlementIds;
      const result = await Settlement.updateMany(
        { _id: { $in: settlementIds } },
        { status }
      );

      if (result.nModified === 0) {
        return res.status(404).json({ message: "No settlements updated" });
      }

      return res.status(200).json({
        message: `${result.nModified} settlements updated successfully`,
      });
    }

    const updatedSettlement = await Settlement.findByIdAndUpdate(
      settlementId,
      { status },
      { new: true }
    );

    if (!updatedSettlement) {
      return res.status(404).json({ message: "Settlement not found" });
    }

    res.status(200).json({
      message: "Settlement updated successfully",
      data: updatedSettlement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: error.message });
  }
});

module.exports = router;
