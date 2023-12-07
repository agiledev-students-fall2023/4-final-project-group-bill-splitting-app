const express = require("express");
const router = express.Router();
const { Expense } = require("../models/Expense.js");

router.get("/ExpenseDetail/:expenseId", async (req, res) => {
  try {
    const expenseId = req.params.expenseId;

    const expenseSplit = await Expense.findById(expenseId)
      .populate("event")
      .populate("paidBy", "username")
      .populate({
        path: "splitDetails",
        populate: {
          path: "settlement",
          model: "Settlement",
        },
      })
      .populate({
        path: "splitDetails",
        populate: {
          path: "user",
          model: "User",
        },
      });

    if (!expenseSplit) {
      return res.status(404).json({ message: "Expense not found" });
    }
    // Return the user's events
    res.json(expenseSplit);
  } catch (error) {
    console.error("Error fetching expense details:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
