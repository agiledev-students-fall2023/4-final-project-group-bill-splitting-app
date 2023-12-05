const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const settlementSchema = new Schema({
  status: Boolean,
  amount: Number,
  settleTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  settleFrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  expense: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
});

// create mongoose Model
const Settlement = mongoose.model("Settlement", settlementSchema);

// export the model so other modules can import it
module.exports = {
  Settlement,
};
