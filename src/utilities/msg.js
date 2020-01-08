const { RichEmbed } = require('discord.js');

function pushError(message, errMsg) {
    const errorEmbed = new RichEmbed();

    errorEmbed.setTitle('Eroare');
    errorEmbed.setDescription(errMsg);

    message.channel.send(errorEmbed);
}

function pushExample(message, usageMsg) {
    const usageEmbed = new RichEmbed();

    usageEmbed.setTitle('Exemplu de folosire');
    usageEmbed.setDescription(usageMsg);

    message.channel.send(usageEmbed);
}

module.exports = {
    pushError: pushError,
    pushExample: pushExample
};
