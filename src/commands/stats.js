const Command = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');

class Stats extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            description: 'Afișează statisticile botului.',
            category: 'Diverse'
        });
    }

    async run(message, args) {
        cpuStat.usagePercent(function(err, percent, seconds) {
            if (err) return console.log(err);

            let memory = (os.totalmem() / 1024 / 1024).toFixed(2);
            let memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            let cpu = os.cpus().map(i => `${i.model}`)[0];
            let cpuUsage = percent.toFixed(2);
            let arch = os.arch();
            let platform = os.platform();

            let statsEmbed = new RichEmbed()
                .setColor('#0071ff')
                .setDescription(
                    `**Memory Usage:** ${memoryUsage} / ${memory} MB\n**CPU:** ${cpu}\n**CPU Usage:** ${cpuUsage}%\n**Arch:** ${arch}\n**Platform:** ${platform}`
                );
            message.channel.send(statsEmbed);
        });
    }
}

module.exports = Stats;
