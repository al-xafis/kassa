const { User } = require("./database");

const askForContact = (bot, ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Нажмите на кнопку чтобы ввести телефон номера",
    {
      reply_markup: {
        keyboard: [
          [{ text: "your phone number", request_contact: true }],
          [{ text: "back" }],
        ],
        resize_keyboard: true,
      },
    }
  );
};

const checkContactOnMessage = (bot) => {
  bot.on("message", async (ctx) => {
    if (ctx.update.message.contact) {
      console.log("there is a contact");
      new User(ctx.update.message.contact).save();
      console.log(ctx.update.message.contact);
      bot.telegram.sendMessage(ctx.chat.id, "Меню", {
        reply_markup: {
          keyboard: [
            [{ text: "📥 Deposit" }, { text: "📤 Withdraw" }],
            [{ text: "💰 kurs" }],
            [{ text: "📞 Contact" }, { text: "🗄 History" }],
          ],
          resize_keyboard: true,
        },
      });
    }
  });
};

module.exports = { askForContact, checkContactOnMessage };
