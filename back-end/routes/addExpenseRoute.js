const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { Expense } = require("../models/Expense.js");
const { Settlement } = require("../models/Settlement.js");
const { Event } = require("../models/Event");

router.post(
  "/",
  // validation rules
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("totalAmount").isNumeric().withMessage("Amount should be a number"),
    body("date").not().isEmpty().withMessage("Date is required"),
    body("paidBy").not().isEmpty().withMessage("Person who paid is required"),
    // Add other validation rules as needed
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("validation passed");

    try {
      const newExpense = new Expense({
        name: req.body.name,
        description: req.body.description,
        totalAmount: req.body.totalAmount,
        date: new Date(req.body.date),
        paidBy: req.body.paidBy,
        event: req.body.event,
      });

      const savedExpense = await newExpense.save();

      let splitDetailsWithSettlements = [];
      for (const split of req.body.peopleSplit) {
        const settleTo = req.body.paidBy;
        const settleFrom = split.user;
        let newSettlement = new Settlement({
          status: settleTo.toString() === settleFrom._id.toString(),
          amount: split.amount,
          settleTo: settleTo,
          settleFrom: settleFrom,
          event: req.body.event,
          expense: savedExpense._id,
        });

        await newSettlement.save();
        splitDetailsWithSettlements.push({
          user: split.user,
          settlement: newSettlement._id,
        });
      }

      savedExpense.splitDetails = splitDetailsWithSettlements;
      await savedExpense.save();

      const event = await Event.findById(req.body.event);
      if (!event) {
        return res
          .status(404)
          .json({ status: "Error", message: "Event not found" });
      }

      event.expenses.push(savedExpense._id);
      await event.save();

      res.status(201).json({
        status: "Success",
        message: "Expense added successfully",
        data: savedExpense,
      });
    } catch (error) {
      res.status(500).json({ status: "Error", message: error.message });
    }
  }
);

module.exports = router;
