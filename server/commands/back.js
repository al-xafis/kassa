module.exports = (bot) => {
  bot.hears("back", (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "Меню", {
      reply_markup: {
        keyboard: [
          [{ text: "📥 Deposit" }, { text: "📤 Withdraw" }],
          [{ text: "💰 kurs" }],
          [{ text: "📞 Contact" }, { text: "📞 History" }],
        ],
        resize_keyboard: true,
      },
    });
  });
};
