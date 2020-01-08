const Command = require('../extends/commands.js');

class Say extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            description: 'Spune ceva în numele botului.',
            category: 'System',
            usage: 'say <message>',
            permissions: ['ADMINISTRATOR']
        });
    }

    async run(message, args) {
        if (!args[0]) return;

        let sayMsg = args.join(' ');

        message.delete();
        message.channel.send(sayMsg);
    }
}

module.exports = Say;
