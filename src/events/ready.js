const fs = require('fs');

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        this.client.user.setStatus('dnd');
        this.client.user.setActivity('with www.leaks.ro');

        this.client.setInterval(() => {
            for (let i in this.client.mutes) {
                let muteTime = this.client.mutes[i].time;
                let guildID = this.client.mutes[i].guild;
                let guild = this.client.guilds.get(guildID);
                let muteUser = guild.members.get(i);

                let muteRole = guild.roles.find(r => r.name === 'Muted');
                if (!muteRole) continue;
                if (!muteUser) continue;

                if (Date.now() > muteTime) {
                    muteUser.removeRole(muteRole);
                    delete this.client.mutes[i];

                    fs.writeFile(
                        './mutes.json',
                        JSON.stringify(this.client.mutes),
                        err => {
                            if (err) throw err;
                        }
                    );
                }
            }
        }, 1000);
    }
};
