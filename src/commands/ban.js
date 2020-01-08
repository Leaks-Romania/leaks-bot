const Command = require('../extends/commands.js');
const { getCaseNum } = require('../utilities/case.js');
const { RichEmbed } = require('discord.js');
const { pushError } = require('../utilities/msg.js');

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Interzice un membru pe server.',
            category: 'Moderation',
            usage: 'ban <@target> <reason>',
            permissions: ['ADMINISTRATOR']
        });
    }

    async run(message, args) {
        let target = message.guild.member(
            message.mentions.users.first() || message.guild.members.get(args[0])
        );
        if (!target) return pushError(message, 'Membrul menționat nu se află pe server.');

        const modlog = this.client.channels.find(channel => channel.name === 'mod-logs');
        const caseNum = await getCaseNum(this.client, modlog);

        if (!modlog) return pushError(message, `Nu am găsit canalul **mod-logs**.`);

        args.shift();

        var reason = args.join(' ');

        if (!reason) reason = 'Fără motiv.';

        const banEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setTitle(
                `${target.user.username}#${target.user.discriminator} a primit ban.`
            )
            .setDescription(
                `**ID:** ${target.id}\n\n**Moderator:** ${message.author.tag}\n**Motiv:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/NMci9Np.png');
        message.channel.send(banEmbed);

        const logEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setDescription(
                `**Action:** Ban\n**Target:** ${target} (ID: ${target.id})\n**Moderator:** ${message.author.tag} (ID: ${message.author.id})\n**Reason:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/NMci9Np.png');
        this.client.channels.get(modlog.id).send(logEmbed);

        message.guild.member(target).ban(reason);
    }
}

module.exports = Ban;
