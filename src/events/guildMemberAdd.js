const { RichEmbed } = require('discord.js');

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member) {
        if (member.user.bot || member.guild.id !== process.env.SERVERID) return;

        member.guild.channels
            .find(c => c.id == process.env.WELCOMECHANNEL)
            .send(
                `Salut <@${member.user.id}>, bine ai venit pe ${member.guild.name}. :wave:`
            )
            .catch(console.error);

        const welcomeEmbed = new RichEmbed()
            .setColor('#0071ff')
            .setTitle(`Membru Nou`)
            .addField(member.guild.name, `Bine ai venit, <@${member.user.id}>`)
            .setTimestamp()
            .setFooter('Creat special pentru comunitatea Leaks România')
            .setThumbnail('https://i.imgur.com/2OM81ez.png');

        member.guild.channels
            .find(c => c.id == process.env.GENERALCHANNEL)
            .send(welcomeEmbed)
            .then(msg => msg.delete(10000))
            .catch(console.error);

        let memberRole = member.guild.roles.find(r => r.name === 'Members');
        if (!memberRole) return;

        await member.addRole(memberRole.id);

        for (let i in this.client.mutes) {
            let guildID = this.client.mutes[i].guild;
            let guild = this.client.guilds.get(guildID);
            let haveMute = guild.members.get(i);

            let muteRole = guild.roles.find(r => r.name === 'Muted');
            if (!muteRole) continue;

            if (haveMute.id === member.user.id) {
                haveMute.addRole(muteRole.id);
            }
        }
    }
};
