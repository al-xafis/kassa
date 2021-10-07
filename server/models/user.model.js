const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TransactionSchema = require("./transaction.model");

// const HistorySchema = new Schema({
//     id: {
//         type: String,
//     },
//     account_id: {
//         type: Number,
//     },
//     card_number: {
//         type: Number,
//     },
//     card_date: {
//         type: Number,
//     },
//     amount: {
//         type: Number,
//     }
// }, {
//     timestamps: true,
// })

const UserSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
    },
    user_id: {
      type: Number,
      required: true,
    },
    history: [{ id: { type: Number } }],
  },
  {
    timestamps: true,
  }
);

mongoose.model("user", UserSchema);
