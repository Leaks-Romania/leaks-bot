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

            let avatarEmbed = new RichEmbed()
                .setImage(mentionedUser.displayAvatarURL)
                .setColor('#0071ff')
                .setTitle(`Avatarul lui ${mentionedUser.tag}`)
                .setFooter('Cerut de ' + message.author.tag)
                .setDescription(
                    '[Avatar URL link](' + mentionedUser.displayAvatarURL + ')'
                );
            message.channel.send(avatarEmbed);

            msg.delete();
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Avatar;
