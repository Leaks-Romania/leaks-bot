const Commands = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');
const randomPuppy = require('random-puppy');

class Meme extends Commands {
    constructor(client) {
        super(client, {
            name: 'meme',
            description: 'Afișează un meme random.',
            category: 'Divertisment'
        });
    }

    async run(message, args) {
        try {
            const subReddits = ['dankmeme', 'meme', 'me_irl'];
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];

            const img = await randomPuppy(random);
            const embed = new RichEmbed()
                .setColor('#0071ff')
                .setImage(img)
                .setTitle(`From /r/${random}`)
                .setURL(`https://reddit.com/r/${random}`);

            message.channel.send(embed);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Meme;
