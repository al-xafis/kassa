const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

require("./models/user.model");
const User = mongoose.model("user");
const Transaction = mongoose.model("transaction");
const userCollection = User.db.collection("users");

module.exports = { connectToDatabase, User, Transaction, userCollection };
