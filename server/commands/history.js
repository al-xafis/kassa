const axios = require("axios");
const { connectToMysql } = require("../database");
const {
  format,
  formatDistanceToNow,
  differenceInDays,
  differenceInHours,
} = require("date-fns");

let db = null;
(async () => (db = await connectToMysql()))();

module.exports = (bot) => {
  bot.hears("📞 History", async (ctx) => {
    let user_id = null;
    let transactions = null;
    try {
      const [row] = await db.execute("SELECT * FROM users WHERE tg_id = ?", [
        ctx.from.id,
      ]);
      user_id = row[0].id;
    } catch (error) {
      console.log(error);
    }
    try {
      const [row] = await db.execute(
        "SELECT * FROM transactions WHERE user_id = ?",
        [user_id]
      );
      transactions = row;
      console.log(row);
    } catch (error) {
      console.log(error);
    }
    transactions.map((transaction) => {
      const result = differenceInDays(
        new Date(transaction.created_at),
        new Date()
      );

      // secondary logic
      const sdate = new Date(transaction.created_at);
      const difference = new Date() - sdate;
      const numberOfDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      console.log(numberOfDays);
      // secondary logic
      if (numberOfDays <= 1) {
        ctx.reply(`Номер заказа: ${transaction.id}
        ID аккаунта: ${transaction.x_id}
        Сумма: ${transaction.amount}
        Статус: ${transaction.completed}
        Дата: ${transaction.created_at}`);
      }
    });
  });
};
