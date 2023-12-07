const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: String,
  user: String,
});

// create mongoose Model
const Message = mongoose.model("Message", messageSchema);

// export the model so other modules can import it
module.exports = {
  Message,
};
