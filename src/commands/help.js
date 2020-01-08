const Command = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');
const { pushError } = require('../utilities/msg.js');

class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Afișează toate comenzile disponibile în funcție de categorii.',
            category: 'Ajutor',
            usage: 'help <command>',
            aliases: ['ajutor', 'comenzi'],
            permissions: ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS']
        });
    }

    async run(message, args) {
        if (!args[0]) {
            const commands = Array.from(this.client.commands.keys());
            const longest = commands.reduce((long, str) => Math.max(long, str.length), 0);

            let currentCategory = '';
            let output = '';

            const helpEmbed = new RichEmbed();

            helpEmbed.setTitle('Comenzi disponibile');
            helpEmbed.setColor('#0071ff');

            const sorted = this.client.commands.sort((p, c) =>
                p.help.category > c.help.category
                    ? 1
                    : p.help.name > c.help.name && p.help.category === c.help.category
                    ? 1
                    : -1
            );
            sorted.forEach(c => {
                const cat = c.help.category.toUpperCase();

                if (currentCategory !== cat) {
                    output += `**${cat}**\n`;
                    currentCategory = cat;
                }

                output += `${c.help.name} ➝ ${' '.repeat(longest - c.help.name.length)} ${
                    c.help.description
                }\n`;
            });

            helpEmbed
                .setDescription(
                    `Folosește /help [comanda] pentru mai multe detalii\n\n${output}`
                )
                .setFooter('Creat special pentru comunitatea Leaks România')
                .setThumbnail('https://i.imgur.com/2OM81ez.png')
                .setTimestamp();
            message.channel.send(helpEmbed);
        } else {
            let command = args[0];

            if (!this.client.commands.has(command))
                return pushError(
                    message,
                    'Această comanda nu există sau este o prescurtare.'
                );

            command = this.client.commands.get(command);

            const _helpEmbed = new RichEmbed()
                .setTitle(`Comanda ${command.help.name}`)
                .setColor('#0071ff')
                .setDescription(
                    `${command.help.description}\n\nExemplu de folosire: ` +
                        '**' +
                        command.help.usage +
                        '**\nPrescurtări: ' +
                        '**' +
                        (command.conf.aliases.length > 0
                            ? command.conf.aliases.join(', ')
                            : 'Nu au fost setate prescurtari.') +
                        '**\nPermisiuni: ' +
                        '**' +
                        (command.conf.permissions.length > 0
                            ? command.conf.permissions.join(', ')
                            : 'Nu au fost setate permisiuni.') +
                        '**'
                )
                .setFooter('Creat special pentru comunitatea Leaks România')
                .setThumbnail('https://i.imgur.com/2OM81ez.png')
                .setTimestamp();
            message.channel.send(_helpEmbed);
        }
    }
}

module.exports = Help;
