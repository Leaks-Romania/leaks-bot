module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        this.client.user.setStatus('dnd');
        this.client.user.setActivity('with www.leaks.ro');
    }
};
