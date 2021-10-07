const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

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

const connectToMysql = async () => {
  const db = await mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "qwerty12",
    database: "kassa",
  });
  return db;
};

module.exports = {
  connectToDatabase,
  User,
  Transaction,
  userCollection,
  connectToMysql,
};
