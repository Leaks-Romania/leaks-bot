const Commands = require('../extends/commands.js');
const { pushError } = require('../utilities/msg.js');
const { getCaseNum } = require('../utilities/case.js');
const { RichEmbed } = require('discord.js');

class Unban extends Commands {
    constructor(client) {
        super(client, {
            name: 'unban',
            description: 'Sterge pe cineva de pe lista de interziceri.',
            category: 'System',
            usage: 'unban <target/id> <reason>',
            aliases: ['ADMINISTRATOR']
        });
    }

    async run(message, args) {
        try {
            if (!args[0] || args[0].length < 0)
                return pushError(
                    message,
                    `Ai uitat să introduci numele celui pe care vrei sa-l ștergi de pe lista de interziceri.`
                );

            let User = args[0];
            let Reason = args.slice(1).join(` `);
            if (!Reason) Reason = `Fără motiv.`;

            const modlog = this.client.channels.find(
                channel => channel.name === 'mod-logs'
            );
            const caseNum = await getCaseNum(this.client, modlog);

            if (!modlog) return pushError(message, `Nu am găsit canalul **mod-logs**.`);

            message.guild.fetchBans().then(bans => {
                if (bans.some(u => User.includes(u.username))) {
                    let user = bans.find(user => user.username === User);

                    if (!user)
                        return pushError(
                            message,
                            `Această persoana nu este interiză pe server.`
                        );

                    message.guild.unban(user.id, Reason);

                    const unbanEmbed = new RichEmbed()
                        .setColor('#0071ff')
                        .setTitle(`${user.tag} a primit unban.`)
                        .setDescription(
                            `**ID:** ${user.id}\n\n**Moderator:** ${message.author.tag}\n**Motiv:** ${Reason}`
                        )
                        .setFooter(`Case ${caseNum}`)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/kHKcms1.png');
                    message.channel.send(unbanEmbed);

                    const logEmbed = new RichEmbed()
                        .setColor('#0071ff')
                        .setDescription(
                            `**Action:** Unban\n**Target:** ${user} (ID: ${user.id})\n**Moderator:** ${message.author.tag} (ID: ${message.author.id})\n**Reason:** ${Reason}`
                        )
                        .setFooter(`Case ${caseNum}`)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/kHKcms1.png');
                    this.client.channels.get(modlog.id).send(logEmbed);
                } else if (bans.some(u => User.includes(u.id))) {
                    message.guild.unban(User, Reason);

                    const unbanEmbed2 = new RichEmbed()
                        .setColor('#0071ff')
                        .setTitle(`${User} a primit unban.`)
                        .setDescription(
                            `**ID:** ${User}\n\n**Moderator:** ${message.author.tag}\n**Motiv:** ${Reason}`
                        )
                        .setFooter(`Case ${caseNum}`)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/kHKcms1.png');
                    message.channel.send(unbanEmbed2);

                    const logEmbed2 = new RichEmbed()
                        .setColor('#0071ff')
                        .setDescription(
                            `**Action:** Unban\n**Target:** ${User}\n**Moderator:** ${message.author.tag} (ID: ${message.author.id})\n**Reason:** ${Reason}`
                        )
                        .setFooter(`Case ${caseNum}`)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/kHKcms1.png');
                    this.client.channels.get(modlog.id).send(logEmbed2);
                } else {
                    return pushError(
                        message,
                        `Această persoana nu este interiză pe server.`
                    );
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Unban;
