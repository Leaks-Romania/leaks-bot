require('dotenv-flow').config();

const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const klaw = require('klaw');
const { parse } = require('path');
const { log } = require('./src/utilities/logs.js');

const LeaksBot = require('./src/extends/leaksbot.js');
const client = new LeaksBot({ disableEveryone: true, autoReconnect: true });

const init = async () => {
    let totalCommandsLoaded = 0;

    klaw('./src/commands').on('data', item => {
        const cmdFile = parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== '.js') return;

        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);

        if (response) console.error(response);
        else totalCommandsLoaded += 1;
    });

    let totalEventsLoaded = 0;
    const events = await readdir('./src/events');
    events.forEach(event => {
        const eventName = event.split('.')[0];
        const eventFunc = new (require(`./src/events/${event}`))(client);

        client.on(eventName, (...args) => eventFunc.run(...args));
        delete require.cache[require.resolve(`./src/events/${event}`)];

        totalEventsLoaded++;
    });

    setTimeout(() => {
        log(`Loaded ${totalEventsLoaded} events.`);
        log(`Loaded ${totalCommandsLoaded} commands.`);

        client.login(process.env.TOKEN).then(() => {
            log('Bot connected.', 'ready');
        });
    }, 1000);
};

init();
