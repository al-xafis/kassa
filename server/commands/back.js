module.exports = (bot) => {
  bot.hears("back", (ctx) => {
    // ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, "Меню", {
      reply_markup: {
        keyboard: [
          [{ text: "📥 Deposit" }, { text: "📤 Withdraw" }],
          [{ text: "💰 kurs" }],
          [{ text: "📞 Contact" }],
        ],
        resize_keyboard: true,
      },
    });
  });
};