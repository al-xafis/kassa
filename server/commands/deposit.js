const Scene = require('telegraf/scenes/base');
const { askForContact } = require('../helper');




module.exports = (bot, db) => {
     





    // bot.hears('📥 Deposit', async (ctx, next) => {
    //     ctx.deleteMessage();
    //     const user = await db.findOne({user_id: ctx.from.id});
    //     if (user) {
    //         ctx.reply('Input your card number');
    //         console.log(ctx);
    //         bot.on('text', ctx => ctx.reply('hello'));
    //         // bot.hears([/\d\d\d\d \d\d\d\d \d\d\d\d \d\d\d\d/, /\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d/], ctx => {
    //         //     ctx.reply('i got credit card')
    //         //     console.log(ctx);
    //         //     bot.hears('cvv number', ctx => {
    //         //         console.log('input your cvv');
    //         //     })
    //         // })
    //     } else {
    //         askForContact(bot, ctx);  
    //     }
    // })
}

