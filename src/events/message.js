module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;
        if (
            message.guild &&
            !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')
        )
            return;

        const prefixes = [
            '/',
            'leo',
            'leo pls',
            'kenn',
            'kenn pls',
            'emrys',
            'emrys pls',
            'views',
            'views pls'
        ];

        let prefix = false;

        for (const thisPrefix of prefixes)
            if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;

        if (!prefix) return;

        const args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd =
            this.client.commands.get(command) ||
            this.client.commands.get(this.client.aliases.get(command));

        if (!cmd) return;

        if (!message.member.hasPermission(...cmd.conf.permissions))
            return message.reply(`Nu ai acces la aceasta comanda.`);

        cmd.run(message, args);
    }
};
