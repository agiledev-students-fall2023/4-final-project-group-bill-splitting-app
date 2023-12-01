const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense.js");

router.get("/ExpenseDetail/:expenseId", async (req, res) => {
    try {
      const expenseId = req.params.expenseId;
  
      // Fetch the user and populate the events
      const expenseSplit = await Expense.findById(expenseId).populate("splitDetails");
  
      if (!expenseSplit) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      console.log(expenseId)
      console.log(expenseSplit)
      // Return the user's events
      res.json(expenseSplit);
    } catch (error) {
      console.error("Error fetching expense details:", error);
      res.status(500).json({ message: "Server error" , error});
    }
  });


module.exports = router;