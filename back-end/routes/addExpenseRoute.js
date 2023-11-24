const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { Expense } = require("../models/Expense.js");

router.post(
  "/",
  // validation rules
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("amount").isNumeric().withMessage("Amount should be a number"),
    body("date").not().isEmpty().withMessage("Date is required"),
    body("personPaid")
      .not()
      .isEmpty()
      .withMessage("Person who paid is required"),
    // Add other validation rules as needed
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create a new Expense object
      const newExpense = new Expense({
        name: req.body.name,
        description: req.body.description,
        totalAmount: req.body.amount,
        date: new Date(req.body.date),
        paidBy: req.body.personPaid,
        splitDetails: req.body.peopleSplit.map((split) => ({
          user: split.user,
          settlement: split.settlement,
        })),
      });

      // Save the Expense object to the database
      await newExpense.save();

      // Send a success response
      res.status(201).json({
        status: "Success",
        message: "Expense added successfully",
        data: newExpense,
      });
    } catch (error) {
      // Handle any errors that occur during saving to database
      res.status(500).json({ status: "Error", message: error.message });
    }
  }
);

module.exports = router;
