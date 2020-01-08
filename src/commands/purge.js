const Command = require('../extends/commands.js');
const { pushError } = require('../utilities/msg.js');

class Purge extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            description: 'Șterge un număr setat de mesaje',
            category: 'System',
            usage: 'purge <lines (max 100)>',
            aliases: ['clear'],
            permissions: ['ADMINISTRATOR']
        });
    }

    async run(message, args) {
        if (!args[0])
            return pushError(
                message,
                'Ai uitat să introduci numărul de mesaje pe care vrei să-l ștergi.'
            );

        if (args[0] > 100 || args[0] <= 0)
            return pushError(message, 'Poți șterge intre 1 și 100 de mesaje.');

        message.channel.bulkDelete(parseInt(args[0])).then(() => {
            message.channel
                .send(`Au fost sterse ${parseInt(args[0])} mesaje.`)
                .then(msg => msg.delete(5000));
        });
    }
}

module.exports = Purge;
