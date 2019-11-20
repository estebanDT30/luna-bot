module.exports = class FunctionHandler {
	constructor(pClient) {
		this.client = pClient;
	}

	getRandomInt(pMin, pMax) {
		const func = require("./functions/random-int.js");

		const min = pMin;
		const max = pMax;

		var result;

		if (min <= max) {
			result = func.getRndInt(min, max);
		} else {
			result = "ERROR: El mínimo no puede ser mayor que el máximo.";
		}

		return result;
	}

	getUser(pId) {
		const func = require("./functions/get-user.js");

		const id = pId;

		if (id != "") {
			const result = func.getUser(id, client);
		} else {
			const result = "ERROR: No se ha proporcionado un ID a buscar.";
		}

		return result;
	}
};