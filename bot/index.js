const { prefix, token, userID, ownerID } = require("./assets/vars/config.json");

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: 'l!',
	owner: 'Tu id aquí',
	disableEveryone: true
});