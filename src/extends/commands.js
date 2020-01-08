class Command {
    constructor(
        client,
        {
            name = null,
            description = 'Nicio descriere setată.',
            category = 'Diverse',
            usage = 'Nicio folosire setată.',
            aliases = new Array(),
            permissions = new Array()
        }
    ) {
        this.client = client;
        this.conf = { aliases, permissions };
        this.help = { name, description, category, usage };
    }
}

module.exports = Command;
