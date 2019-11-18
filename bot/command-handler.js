module.exports = class CommandHandler {
	constructor(pClient) {
		this.client = pClient;
	}

	calc() {
		const comm = require("./commands/calc.js");
	}

	flip() {
		const comm = require("./commands/flip.js");
	}

	help() {
		const comm = require("./commands/help.js");
	}

	info() {
		const comm = require("./commands/info.js");
	}

	kill() {
		const comm = require("./commands/kill.js");
	}

	nick() {
		const comm = require("./commands/nick.js");
	}

	roll() {
		const comm = require("./commands/roll.js");
	}

	say() {
		const comm = require("./commands/say.js");
	}
}