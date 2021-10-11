const { connectToMysql } = require("./database");
const { format } = require("date-fns");

let db = null;
(async () => (db = await connectToMysql()))();

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
      // new User(ctx.update.message.contact).save();
      console.log(ctx.update.message.contact);
      let phone_number = ctx.update.message.contact.phone_number;
      let first_name = ctx.update.message.contact.first_name;
      let tg_id = ctx.update.message.contact.user_id;
      let date = format(Date.now(), "Pp");
      try {
        await db.query(
          "INSERT INTO users (phone_number, first_name, tg_id, created_at) VALUES(?,?,?,?)",
          [phone_number, first_name, tg_id, date],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              console.log(result);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
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
