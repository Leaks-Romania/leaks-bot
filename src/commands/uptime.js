const Command = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');

class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            description: 'Afișează uptime-ul botului.',
            category: 'Diverse',
            aliases: ['up']
        });
    }

    async run(message, args) {
        let totalSeconds = this.client.uptime / 1000;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let uptime = `${hours.toFixed(0)} ore, ${minutes.toFixed(
            0
        )} minute și ${seconds.toFixed(0)} secunde.`;

        let embed = new RichEmbed()
            .setColor('#0071ff')
            .setDescription(`Sunt online de ${uptime}`);
        message.channel.send(embed);
    }
}

module.exports = Uptime;
