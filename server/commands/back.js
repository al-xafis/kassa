module.exports = (bot) => {
  bot.hears("back", (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "ะะตะฝั", {
      reply_markup: {
        keyboard: [
          [{ text: "๐ฅ Deposit" }, { text: "๐ค Withdraw" }],
          [{ text: "๐ฐ kurs" }],
          [{ text: "๐ Contact" }, { text: "๐ History" }],
        ],
        resize_keyboard: true,
      },
    });
  });
};
