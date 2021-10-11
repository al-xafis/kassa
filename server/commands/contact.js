const { askForContact } = require("../helper");
const _ = require("lodash");
const { connectToMysql } = require("../database");

let db = null;
(async () => (db = await connectToMysql()))();

module.exports = (bot) => {
  bot.hears("📞 Contact", async (ctx) => {
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
    }
    if (!_.isEmpty(user)) {
      bot.telegram.sendMessage(
        ctx.chat.id,
        "Если у вас есть вопросы, пожалуйста обратитесь к нам",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Operator", url: "https://t.me/qwertyacc" }],
            ],
          },
        }
      );
    } else {
      askForContact(bot, ctx);
    }
  });
};
