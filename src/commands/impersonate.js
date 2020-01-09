const Command = require('../extends/commands.js');
const { GuildMember } = require('discord.js');

class Impersonate extends Command {
    constructor(client) {
        super(client, {
            name: 'impersonate',
            description: 'Spune ceva in numele membrului mentionat.',
            category: 'System',
            usage: 'impersonate <target ID> <message>',
            permissions: ['MANAGE_WEBHOOKS']
        });
    }

    async run(message, args) {
        let user = message.guild.member(
            message.mentions.users.first() || message.guild.members.get(args[0])
        );
        if (!user) return;

        if (user instanceof GuildMember) user = user.user;

        const msg = args.slice(1).join(' ');
        if (!msg) return;

        message.delete();

        const hook = await message.channel.createWebhook(
            user.username,
            user.displayAvatarURL
        );
        await hook.send(msg);
        await hook.delete();
    }
}

module.exports = Impersonate;
