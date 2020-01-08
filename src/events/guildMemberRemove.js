module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member) {
        if (member.user.bot || member.guild.id !== process.env.SERVERID) return;
        member.guild.channels
            .find(c => c.name === 'bun-venit')
            .send(`<@${member.user.id}> a iesit de pe server.`)
            .catch(console.error);
    }
};
