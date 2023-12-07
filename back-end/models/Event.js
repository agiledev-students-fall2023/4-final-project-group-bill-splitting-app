const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./User");
const { Expense } = require("./Expense");

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = {
  Event,
};
