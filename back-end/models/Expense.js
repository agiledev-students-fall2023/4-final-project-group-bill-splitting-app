const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const Event = require("./Event");
const Settlement = require("./Settlement");

const splitDetailsSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  settlement: { type: mongoose.Schema.Types.ObjectId, ref: "Settlement" },
});

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  splitDetails: [splitDetailsSchema],
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

// create mongoose Model
const Expense = mongoose.model("Expense", expenseSchema);

// export the model so other modules can import it
module.exports = {
  Expense,
};
