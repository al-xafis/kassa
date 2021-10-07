module.exports = (bot) => {
    bot.hears('📤 Withdraw', ctx => {
        bot.telegram.sendPhoto(ctx.chat.id, {source: 'src/images/withdraw1.jpg'}, {caption: 'Чтобы подать заявку на вывод, сделайте скриншот в вашем аккаунте и отправьте в чат'})
    })
}