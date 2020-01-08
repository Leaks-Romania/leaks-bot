const Command = require('../extends/commands.js');
const fs = require('fs');
const { getCaseNum } = require('../utilities/case.js');
const { RichEmbed } = require('discord.js');
const { pushError } = require('../utilities/msg.js');

class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            description: 'Dă permisiunea unui membru adus la tăcere să vorbească',
            category: 'Moderation',
            usage: 'unmute <@target> <reason>',
            permissions: ['KICK_MEMBERS']
        });
    }

    async run(message, args) {
        let target = message.guild.member(
            message.mentions.users.first() || message.guild.members.get(args[0])
        );
        if (!target) return pushError(message, 'Membrul menționat nu se află pe server.');

        let muteRole = message.guild.roles.find(r => r.name === 'Muted');
        if (!muteRole) return pushError(message, 'Nu am putut găsi rolul **Muted**.');

        if (!target.roles.has(muteRole.id))
            return pushError(message, 'Membrul menționat este nu a fost adus la tăcere.');

        const modlog = this.client.channels.find(
            channel => channel.id == process.env.MODLOGSCHANNEL
        );
        const caseNum = await getCaseNum(this.client, modlog);

        if (!modlog) return pushError(message, `Nu am găsit canalul **mod-logs**.`);

        await target.removeRole(muteRole.id);
        delete this.client.mutes[target.id];

        fs.writeFile('./mutes.json', JSON.stringify(this.client.mutes), err => {
            if (err) throw err;
        });

        args.shift();
        args.shift();

        var reason = args.join(' ');

        if (!reason) reason = 'Fără motiv.';

        const muteEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setTitle(
                `${target.user.username}#${target.user.discriminator} a primit unmute.`
            )
            .setDescription(
                `**ID:** ${target.id}\n\n**Moderator:** ${message.author.tag}\n**Motiv:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/wJ4dzg0.png');
        message.channel.send(muteEmbed);

        const logEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setDescription(
                `**Action:** Unmute\n**Target:** ${target} (ID: ${target.id})\n**Moderator:** ${message.author.tag} (ID: ${message.author.id})\n**Reason:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/wJ4dzg0.png');
        return this.client.channels.get(modlog.id).send(logEmbed);
    }
}

module.exports = Unmute;
