const Command = require('../extends/commands.js');
const fs = require('fs');
const { getCaseNum } = require('../utilities/case.js');
const { RichEmbed } = require('discord.js');
const { pushError } = require('../utilities/msg.js');

class Mute extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Adu la tăcere un membru.',
            category: 'Moderation',
            usage: 'mute <@target> <time> <reason>',
            aliases: ['shutup'],
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

        if (target.roles.has(muteRole.id))
            return pushError(message, 'Membrul menționat este adus deja la tăcere.');

        const modlog = this.client.channels.find(
            channel => channel.id == process.env.MODLOGSCHANNEL
        );
        const caseNum = await getCaseNum(this.client, modlog);

        if (!modlog) return pushError(message, `Nu am găsit canalul **mod-logs**.`);

        if (!args[1] || args[1].length < 0)
            return pushError(
                message,
                `Nu ați introdus timpul pentru care vreți să-l aduceți la tăcere pe ${target}.`
            );

        var returnTime, timeMeasure;

        timeMeasure = args[1].substring(args[1].length - 1, args[1].length);
        returnTime = args[1].substring(0, args[1].length - 1);

        switch (timeMeasure) {
            case 's':
                returnTime = returnTime * 1000;
                break;

            case 'm':
                returnTime = returnTime * 1000 * 60;
                break;

            case 'h':
                returnTime = returnTime * 1000 * 60 * 60;
                break;

            case 'd':
                returnTime = returnTime * 1000 * 60 * 60 * 24;
                break;

            default:
                return pushError(message, `Invalid time symbol. (s, m, h, d)`);
        }

        this.client.mutes[target.id] = {
            guild: message.guild.id,
            time: Date.now() + returnTime
        };

        await target.addRole(muteRole.id);

        fs.writeFile('./mutes.json', JSON.stringify(this.client.mutes, null, 4), err => {
            if (err) console.log(err);
        });

        args.shift();
        args.shift();

        var reason = args.join(' ');

        if (!reason) reason = 'Fără motiv.';

        const muteEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setTitle(
                `${target.user.username}#${target.user.discriminator} a primit mute.`
            )
            .setDescription(
                `**ID:** ${target.id}\n\n**Moderator:** ${
                    message.author.tag
                }\n**Timp:** ${returnTime / 1000} secunde\n**Motiv:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/yroG6vy.png');
        message.channel.send(muteEmbed);

        const logEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setDescription(
                `**Action:** Mute\n**Target:** ${target} (ID: ${
                    target.id
                })\n**Moderator:** ${message.author.tag} (ID: ${
                    message.author.id
                })\n**Time:** ${returnTime / 1000} seconds\n**Reason:** ${reason}`
            )
            .setFooter(`Case ${caseNum}`)
            .setTimestamp()
            .setThumbnail('https://i.imgur.com/yroG6vy.png');
        return this.client.channels.get(modlog.id).send(logEmbed);
    }
}

module.exports = Mute;
