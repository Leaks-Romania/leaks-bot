const Command = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');
const { getNiceTime } = require('../utilities/msg.js');

class Serverinfo extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            description: 'Afișează informații despre server.',
            category: 'Diverse',
            aliases: ['guildinfo', 'sinfo', 'ginfo']
        });
    }

    async run(message, args) {
        const verlvl = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: '(╯°□°）╯︵ ┻━┻',
            4: '(ノಠ益ಠ)ノ彡┻━┻'
        };

        let serverEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setTitle(`${message.guild.name}`)
            .setDescription(
                `ID: ${message.guild.id}\n\nSuntem in total ${
                    message.guild.members.filter(member => !member.user.bot).size
                } membrii\nOnline in acest moment: ${
                    message.guild.members.filter(
                        member => member.presence.status !== 'offline' && !member.user.bot
                    ).size
                } membrii\nCreator: ${
                    message.guild.owner.user.tag
                }\nServerul a fost creat acum ${getNiceTime(
                    message.guild.createdAt,
                    new Date(),
                    3,
                    true
                )}`
            )
            .setThumbnail(message.guild.iconURL);

        message.channel.send(serverEmbed);
    }
}

module.exports = Serverinfo;
