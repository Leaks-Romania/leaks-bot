const Command = require('../extends/commands.js');
const { pushError } = require('../utilities/msg.js');

class Reason extends Command {
    constructor(client) {
        super(client, {
            name: 'reason',
            description: 'Modifică motivul unui log.',
            category: 'Moderation',
            usage: 'reason <new reason>',
            aliases: ['motiv'],
            permissions: ['ADMINISTRATOR']
        });
    }

    async run(message, args) {
        const modlog = this.client.channels.find(
            channel => channel.id == process.env.MODLOGSCHANNEL
        );
        const caseNum = args.shift();
        const newReason = args.join(' ');

        if (!modlog) return pushError(message, `Nu am găsit canalul **mod-logs**.`);

        if (!caseNum)
            return pushError(
                message,
                `Nu ai specificat case-ul log-ului pe care vrei să-l modifici.`
            );

        if (!newReason) return pushError(message, `Ai uitat să introduci noul motiv.`);

        await modlog.fetchMessages({ limit: 100 }).then(messages => {
            const caseLog = messages
                .filter(
                    m =>
                        m.author.id === this.client.user.id &&
                        m.embeds[0] &&
                        m.embeds[0].type === 'rich' &&
                        m.embeds[0].footer &&
                        m.embeds[0].footer.text.startsWith('Case') &&
                        m.embeds[0].footer.text === `Case ${caseNum}`
                )
                .first();

            if (!caseLog) return pushError(message, `Case invalid.`);

            modlog
                .fetchMessage(caseLog.id)
                .then(logMsg => {
                    const embed = logMsg.embeds[0];
                    this.embedScan(embed);
                    embed.description = embed.description.replace(
                        'Fără motiv.',
                        newReason
                    );
                    logMsg.edit({ embed });
                })
                .then(() => {
                    message.channel.send(
                        `Motivul log-ului **#${caseNum}** a fost modificat cu succes. Noul motiv: **${newReason}**`
                    );
                });
        });
    }

    async embedScan(embed) {
        embed.message ? delete embed.message : null;
        embed.footer ? delete embed.footer.embed : null;
        embed.provider ? delete embed.provider.embed : null;
        embed.thumbnail ? delete embed.thumbnail.embed : null;
        embed.image ? delete embed.image.embed : null;
        embed.author ? delete embed.author.embed : null;
        embed.fields
            ? embed.fields.forEach(f => {
                  delete f.embed;
              })
            : null;
        return embed;
    }
}

module.exports = Reason;
