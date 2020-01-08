const { Client, Collection } = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const klaw = require('klaw');
const path = require('path');

class LeaksBot extends Client {
    constructor(options) {
        super(options);
    }
}

module.exports = LeaksBot;
