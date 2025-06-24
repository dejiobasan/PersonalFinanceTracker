const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Amount: {
    type: Number,
    min: 0,
    required: [true, "Amount is required"],
  },
  Description: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    enum: ["Credit", "Debit"],
    required: [true, "Type is required"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = new mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
