const { Client, Collection } = require('discord.js');
const { sep } = require('path');

class LeaksBot extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.mutes = require('../../mutes.json');
    }

    loadCommand(cmdPath, cmdName) {
        try {
            const props = new (require(`${cmdPath}${sep}${cmdName}`))(this);

            props.conf.location = cmdPath;

            if (props.init) props.init(this);

            this.commands.set(props.help.name, props);

            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });

            return false;
        } catch (err) {
            return `Unable to load command ${cmdName}: ${err.message}\n${err.stack}`;
        }
    }
}

module.exports = LeaksBot;
