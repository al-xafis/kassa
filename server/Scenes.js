const Scene = require("telegraf/scenes/base");
const { connectToMysql } = require("./database");
const axios = require("axios");
const { format } = require("date-fns");

let db = null;
(async () => (db = await connectToMysql()))();

let idCounter = 1;

class SceneGenerator {
  currencyScene() {
    const currency = new Scene("currency");
    currency.enter(async (ctx) => {
      await ctx.telegram.sendMessage(ctx.chat.id, "Выберите валюту", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "USD", callback_data: "USD" },
              { text: "UZS", callback_data: "UZS" },
            ],
          ],
          resize_keyboard: true,
        },
      });
    });
    currency.action("USD", async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply("Вы выбрали USD счёт");
      ctx.db.currency = "USD";
      await ctx.scene.enter("id");
    });
    currency.action("UZS", async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply("Вы выбрали UZS счёт");
      ctx.db.currency = "UZS";
      await ctx.scene.enter("id");
    });
    currency.hears("◀️ Back", async (ctx) => {
      await ctx.scene.leave();
      await leave(ctx);
    });
    return currency;
  }

  idScene() {
    const id = new Scene("id");
    id.enter(async (ctx) => {
      await kbBack(ctx, "Введите ID аккаунта");
    });
    id.on("text", async (ctx) => {
      if (ctx.message.text.match(/^\d{6,12}$/)) {
        ctx.db.id = ctx.message.text;
        await ctx.reply("ID введен");
        await ctx.scene.enter("card");
      } else if (ctx.message.text == "◀️ Back") {
        await ctx.scene.leave();
        await leave(ctx);
      } else {
        console.log("it is not an ID");
        await ctx.reply("Это не ID");
      }
    });
    return id;
  }

  cardScene() {
    const card = new Scene("card");
    card.enter(async (ctx) => {
      await kbBack(
        ctx,
        "Введите номер карты \nПример: 1234 1234 1234 1234, 1234123412431234"
      );
    });
    card.on("text", async (ctx) => {
      if (ctx.message.text.match(/\b\d{16}\b|\b\d{4} \d{4} \d{4} \d{4}\b/)) {
        let card_number = ctx.message.text;
        card_number = card_number.replace(/\s/g, ""); //trim spaces
        ctx.db.card_number = card_number;
        await ctx.reply("Карта введена");
        await ctx.scene.enter("date");
      } else if (ctx.message.text == "◀️ Back") {
        await ctx.scene.leave();
        await leave(ctx);
      } else {
        console.log("it is not a card number");
        await ctx.reply("Это не номер карты");
      }
    });
    return card;
  }

  dateScene() {
    const date = new Scene("date");
    date.enter(async (ctx) => {
      await kbBack(ctx, "Введите срок карты \nПример: 0526, 05/26");
      // let newId = await getNextSequence("orderid");
      // ctx.db.newId = newId;
    });
    date.on("text", async (ctx) => {
      if (ctx.message.text.match(/\b\d\d\/?\d\d\b/)) {
        if (ctx.message.text.includes("/")) {
          ctx.db.date = ctx.message.text.replace("/", "");
        } else {
          ctx.db.date = ctx.message.text;
        }
        console.log(ctx.db.date);
        await ctx.reply("срок карты введен");
        try {
          const res = await axios.post(
            "https://checkout.paycom.uz/api",
            {
              id: idCounter,
              method: "cards.create",
              params: {
                card: { number: ctx.db.card_number, expire: ctx.db.date },
                save: false,
              },
            },
            {
              headers: {
                "x-auth": process.env.PAYME_TOKEN,
              },
            }
          );
          ctx.db.card_token = res.data.result.card.token;
          console.log("from cards create");
        } catch (error) {
          console.log("catch from cards create: " + error);
          await ctx.reply("Неправильная карта или код");
          await ctx.scene.leave();
          await leave(ctx);
        }
        await ctx.scene.enter("amount");
      } else if (ctx.message.text == "◀️ Back") {
        await ctx.scene.leave();
        await leave(ctx);
      } else {
        console.log("this is not a card date");
        await ctx.reply("Это не срок карты");
      }
    });
    return date;
  }

  amountScene() {
    const amount = new Scene("amount");
    amount.enter(async (ctx) => {
      await kbBack(
        ctx,
        "Введите сумму депозита \nПример: 20000, 50000, 100000"
      );
    });

    // amount.leave(async (ctx) => {
    //   await leave(ctx);
    // });

    amount.on("text", async (ctx) => {
      if (ctx.message.text.match(/^\d+$/)) {
        ctx.db.amountInput = ctx.message.text;
        await ctx.reply("Сумма введена");
        try {
          const res = await axios.post(
            "https://checkout.paycom.uz/api",
            {
              id: idCounter,
              method: "cards.get_verify_code",
              params: {
                token: ctx.db.card_token,
              },
            },
            {
              headers: {
                "x-auth": process.env.PAYME_TOKEN,
              },
            }
          );
          ctx.db.amountInput =
            ctx.db.amountInput * 100; /* to overcome .00 in payme amount */
          console.log("from get verify code");
        } catch (error) {
          console.log("catch from get verify code: " + error);
        }
        await ctx.scene.enter("code");
      } else if (ctx.message.text == "◀️ Back") {
        await ctx.scene.leave();
        await leave(ctx);
      } else {
        console.log("this is not a number");
        await ctx.reply("Это не номер");
      }
    });
    return amount;
  }

  codeScene() {
    const code = new Scene("code");
    let transactionId = null;
    code.enter(async (ctx) => {
      await kbBack(ctx, "Введите код из смс");
    });
    code.on("text", async (ctx) => {
      if (ctx.message.text.match(/^\d+$/)) {
        ctx.db.code = ctx.message.text;
        await ctx.reply("код из смс введен");
        try {
          const res = await axios.post(
            "https://checkout.paycom.uz/api",
            {
              id: idCounter,
              method: "cards.verify",
              params: {
                token: ctx.db.card_token,
                code: ctx.db.code,
              },
            },
            {
              headers: {
                "x-auth": process.env.PAYME_TOKEN,
              },
            }
          );
          console.log("from cards verify");
        } catch (error) {
          console.log("catch from cards verify: " + error);
        }
        try {
          const res = await axios.post(
            "https://checkout.paycom.uz/api",
            {
              id: idCounter,
              method: "receipts.create",
              params: {
                amount: parseInt(ctx.db.amountInput),
                account: {
                  order_id: idCounter,
                },
              },
            },
            {
              headers: {
                "x-auth": process.env.PAYME_FULL_TOKEN,
              },
            }
          );
          ctx.db.receipt_id = res.data.result.receipt._id;
          console.log("from create receipt");
        } catch (error) {
          console.log("catch from receipt create: " + error);
        }
        try {
          const res = await axios.post(
            "https://checkout.paycom.uz/api",
            {
              id: idCounter,
              method: "receipts.pay",
              params: {
                id: ctx.db.receipt_id,
                token: ctx.db.card_token,
              },
            },
            {
              headers: {
                "x-auth": process.env.PAYME_FULL_TOKEN,
              },
            }
          );

          if (!res.data.error) {
            let user_id = null;
            let phone_number = null;
            try {
              let [rows] = await db.execute(
                "SELECT * FROM users WHERE tg_id = ?",
                [ctx.from.id]
              );
              user_id = rows[0].id;
              phone_number = rows[0].phone_number;
            } catch (error) {
              console.log(error);
            }

            try {
              const transaction = await db.execute(
                "INSERT INTO transactions (user_id, phone_number, x_id, card_number, card_date, currency, amount, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  user_id,
                  phone_number,
                  ctx.db.id,
                  ctx.db.card_number,
                  ctx.db.date,
                  ctx.db.currency,
                  ctx.db.amountInput / 100,
                  format(Date.now(), "Pp"),
                ]
              );
              transactionId = transaction[0].insertId;
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log(res.data.error);
            await ctx.reply("Неправильный код");
          }

          console.log("from pay receipt");
        } catch (error) {
          console.log("catch from receipts pay: " + error);
        }

        await ctx.reply(`ID Заказа: ${transactionId}`);
        idCounter++;
        await ctx.scene.leave();
        await leave(ctx);
      } else if (ctx.message.text == "◀️ Back") {
        await ctx.scene.leave();
        await leave(ctx);
        nullifyData(ctx);
      } else {
        console.log("this is not a sms code");
        await ctx.reply("Это не смс код");
      }
    });
    return code;
  }
}

const nullifyData = (ctx) => {
  ctx.db.id = null;
  ctx.db.x_id = null;
  ctx.db.currency = null;
  ctx.db.card_number = null;
  ctx.db.date = null;
  ctx.db.amount = null;
  ctx.db.code = null;
};

const leave = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.chat.id, "Меню", {
    reply_markup: {
      keyboard: [
        [{ text: "📥 Deposit" }, { text: "📤 Withdraw" }],
        [{ text: "💰 kurs" }],
        [{ text: "📞 Contact" }, { text: "📞 History" }],
      ],
      resize_keyboard: true,
    },
  });
};

const kbBack = async (ctx, message) => {
  await ctx.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      keyboard: [[{ text: "◀️ Back" }]],
      resize_keyboard: true,
    },
  });
};

module.exports = SceneGenerator;
