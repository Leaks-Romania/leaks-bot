const Command = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');

class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            description: 'Afișează avatarul dvs. sau a-l membrului menționat',
            category: 'Diverse',
            usage: 'avatar <@target>'
        });
    }

    async run(message, args) {
        try {
            let msg = await message.channel.send('Se generează avatarul...');
            let mentionedUser = message.mentions.users.first() || message.author;

            message.channel.send(
                '```Avatar - ' +
                    mentionedUser.tag +
                    '```' +
                    mentionedUser.displayAvatarURL
            );

            msg.delete();
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Avatar;
