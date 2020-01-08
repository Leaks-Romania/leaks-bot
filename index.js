require('dotenv-flow').config();

const LeaksBot = require('./src/extends/leaksbot.js');
const client = new LeaksBot({ disableEveryone: true, autoReconnect: true });

client.login(process.env.TOKEN);
