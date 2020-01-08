const Command = require('../extends/commands.js');
const { getCaseNum } = require('../utilities/case');
const { RichEmbed } = require('discord.js');
const { pushError } = require('../utilities/msg.js');

class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: 'Dă afară de pe server pe cineva.',
            category: 'Moderation',
            usage: 'kick <@target> <reason>',
            permissions: ['KICK_MEMBERS']
        });
    }

    async run(message, args) {
        let target = message.guild.member(
            message.mentions.users.first() || message.guild.members.get(args[0])
        );
        if (!target) return pushError(message, 'Membrul menționat nu se află pe server.');

        const modlog = this.client.channels.find(
            channel => channel.id == process.env.MODLOGSCHANNEL
        );
        const caseNum = await getCaseNum(this.client, modlog);

        if (!modlog) return pushError(message, `Nu am găsit canalul **mod-logs**.`);

        args.shift();

        var reason = args.join(' ');
        if (!reason) reason = 'Fără motiv.';

        const kickEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setTitle(
                `${target.user.username}#${target.user.discriminator} a primit kick.`
            )
            .setDescription(
                `**ID:** ${target.id}\n\n**Moderator:** ${message.author.tag}\n**Motiv:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/zn106H3.png');
        message.channel.send(kickEmbed);

        const logEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setDescription(
                `**Action:** Kick\n**Target:** ${target} (ID: ${target.id})\n**Moderator:** ${message.author.tag} (ID: ${message.author.id})\n**Reason:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/zn106H3.png');
        this.client.channels.get(modlog.id).send(logEmbed);

        target.kick(reason);
    }
}

module.exports = Kick;
