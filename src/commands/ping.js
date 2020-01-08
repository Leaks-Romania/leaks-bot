const Commands = require('../extends/commands.js');

class Ping extends Commands {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Afișează latență și timpul de răspuns al API-ului.',
            category: 'Diverse',
            aliases: ['pong']
        });
    }

    async run(message, args) {
        try {
            const msg = await message.channel.send('🏓 Ping!');
            msg.edit(
                `🏓 Pong! (Roundtrip took: ${msg.createdTimestamp -
                    message.createdTimestamp}ms. 💙: ${Math.round(this.client.ping)}ms.)`
            );
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Ping;
