const { askForContact } = require("../helper");

module.exports = (bot, db) => {
  bot.hears("📞 Contact", async (ctx) => {
    // ctx.deleteMessage();
    const user = await db.findOne({ user_id: ctx.from.id });
    if (user) {
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
