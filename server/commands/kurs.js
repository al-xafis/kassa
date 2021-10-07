const axios = require('axios');

module.exports = (bot) => {
    bot.hears('💰 kurs', async ctx => {
        let res = await axios.get('https://nbu.uz/exchange-rates/json/');
        const kurs = res.data.find(item => item.code == 'USD');
        const usd = kurs.nbu_cell_price;
        ctx.reply(usd);
    })
}

 