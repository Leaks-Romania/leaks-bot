const Commands = require('../extends/commands.js');
const { promptMessage } = require('../utilities/msg.js');
const { RichEmbed } = require('discord.js');

const chooseArr = ['🗻', '📰', '✂'];

class Rps extends Commands {
    constructor(client) {
        super(client, {
            name: 'rps',
            description: 'Joacă piatră, hârtie, foarfecă cu botul.',
            category: 'Games',
            aliases: ['phf']
        });
    }

    async run(message, args) {
        try {
            const embed = new RichEmbed()
                .setColor('#0071ff')

                .setDescription(
                    'Reacționează cu unul dintre emojiurile de ma jos pentru a juca!'
                );

            const m = await message.channel.send(embed);
            const reacted = await promptMessage(m, message.author, 30, chooseArr);

            const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

            const result = await getResult(reacted, botChoice);
            await m.clearReactions();

            embed.setDescription('').addField(result, `${reacted} vs ${botChoice}`);

            m.edit(embed);

            function getResult(me, clientChosen) {
                if (
                    (me === '🗻' && clientChosen === '✂') ||
                    (me === '📰' && clientChosen === '🗻') ||
                    (me === '✂' && clientChosen === '📰')
                ) {
                    return 'Ai căștigat!';
                } else if (me === clientChosen) {
                    return 'Egalitate!';
                } else {
                    return 'Ai pierdut!';
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Rps;
