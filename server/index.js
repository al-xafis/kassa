const Telegraf = require("telegraf");
require("dotenv").config();
const _ = require("lodash");
const axios = require("axios");
const mongoose = require("mongoose");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const SceneGenerator = require("./Scenes");
const curScene = new SceneGenerator();
const currencyScene = curScene.currencyScene();
const idScene = curScene.idScene();
const cardScene = curScene.cardScene();
const dateScene = curScene.dateScene();
const amountScene = curScene.amountScene();
const codeScene = curScene.codeScene();
const { askForContact, checkContactOnMessage } = require("./helper");
const {
  connectToDatabase,
  userCollection,
  Transaction,
  connectToMysql,
  // db,
} = require("./database");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.port ?? 5000;

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});

(async () => await connectToDatabase())();
let db = null;
(async () => (db = await connectToMysql()))();

app.get("/", async (req, res) => {
  // const transactions = await Transaction.find({ completed: false });
  //mysql
  const [row] = await db.execute(
    "SELECT * FROM transactions WHERE completed = ?",
    [0]
  );
  res.status(200).json(row);
  //mysql
  // res.status(200).json(transactions);
});

app.put("/", async (req, res) => {
  // const transaction = await Transaction.findOneAndUpdate(
  //   { id: req.body.id },
  //   { completed: true },
  //   { upsert: true }
  // );
  try {
    await db.execute("UPDATE transactions SET completed = ? WHERE id = ?", [
      1,
      req.body.id,
    ]);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json("Updated");
});

const bot = new Telegraf(process.env.BOT_TOKEN, {
  polling: false,
});

const stage = new Stage([
  currencyScene,
  idScene,
  cardScene,
  dateScene,
  amountScene,
  codeScene,
]);
bot.use(session());
bot.use(stage.middleware());

bot.context.db = {};

const start = require("./commands/start");
start(bot);

bot.hears("📥 Deposit", async (ctx) => {
  // const user = await userCollection.findOne({ user_id: ctx.from.id });
  let user = {};
  let [rows] = await db.query("SELECT * FROM users WHERE tg_id = ?", [
    ctx.from.id,
  ]);
  if (rows.length > 0) {
    user.id = rows[0].id;
    user.phone_number = rows[0].phone_number;
    user.first_name = rows[0].first_name;
    user.tg_id = rows[0].tg_id;
    user.created_at = rows[0].created_at;
    console.log(user);
  }

  if (!_.isEmpty(user)) {
    ctx.scene.enter("currency");
  } else {
    askForContact(bot, ctx);
  }
});

const back = require("./commands/back");
back(bot);

const contact = require("./commands/contact");
contact(bot, userCollection);

const withdraw = require("./commands/withdraw");
withdraw(bot);

const kurs = require("./commands/kurs");
kurs(bot);

checkContactOnMessage(bot);

bot.launch();
