const Commands = require('../extends/commands.js');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const fetch = require('node-fetch');

class Instagram extends Commands {
    constructor(client) {
        super(client, {
            name: 'instagram',
            description: 'Afișează profilul de instagram',
            category: 'Divertisment',
            aliases: ['insta']
        });
    }

    async run(message, args) {
        try {
            const name = args.join(' ');

            if (!name) {
                return message
                    .reply(
                        'Ai uitatm să introduci numele contului pe care vrei să-l cauți.'
                    )
                    .then(m => m.delete(5000));
            }

            const url = `https://instagram.com/${name}/?__a=1`;

            let res;

            try {
                res = await fetch(url).then(url => url.json());
            } catch (e) {
                return message
                    .reply('Acest username este invalid.')
                    .then(m => m.delete(5000));
            }

            const account = res.graphql.user;

            const embed = new RichEmbed()
                .setColor('#0071ff')
                .setTitle(account.full_name)
                .setURL(`https://instagram.com/${name}`)
                .setThumbnail(account.profile_pic_url_hd)
                .addField(
                    'Profile information',
                    stripIndents`**- Username:** ${account.username}
                **- Full name:** ${account.full_name}
                **- Biography:** ${
                    account.biography.length == 0 ? 'none' : account.biography
                }
                **- Posts:** ${account.edge_owner_to_timeline_media.count}
                **- Followers:** ${account.edge_followed_by.count}
                **- Following:** ${account.edge_follow.count}
                **- Private account:** ${account.is_private ? 'Yes 🔐' : 'Nope 🔓'}`
                );

            message.channel.send(embed);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Instagram;
