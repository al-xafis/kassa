const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    id: {
      type: Number,
    },
    x_id: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    card_number: {
      type: Number,
      required: true,
    },
    card_date: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    phone_number: {
      type: String,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("transaction", TransactionSchema);
// module.exports = Transaction;
