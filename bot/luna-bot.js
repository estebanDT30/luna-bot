//Usar las variables de entorno.
require('dotenv').config();

//Constantes de entorno.
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.DISCORD_PREFIX;
const ownerID = process.env.DISCORD_DEV_ID;

//Constantes de desarrollo.
const Discord = require("discord.js"); //Importación de "discord.js".
const client = new Discord.Client(); //Se crea una sesión.

//Función que, como indica, permite obtener un "User" a partir de una mención.
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.get(mention);
	}
}

function getTime(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();

	if (hours >= 12) {
		time = "PM";
	} else {
		time = "AM";
	}

	hours = hours % 12;

	if (hours) {
		hours = hours;
	} else {
		hours = 12;
	} //The hour '0' should be '12'.

	if (hours < 10) {
		hours = "0" + hours;
	}

	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	const strTime = hours + ':' + minutes + ' ' + time;

	return strTime;
}

function getDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1; //'getMonth()' retorna los meses empezando por el '0'.
	var year = date.getFullYear();

	if (day < 10) {
		day = "0" + day;
	}

	if (month < 10) {
		month = "0" + month;
	}

	const strDate = day + "/" + month + "/" + year;

	return strDate;
}

//Arranque de bot.
client.on("ready", () => {
	const startDateTime = client.readyAt;

	client.user.setStatus("online"); //Definir estado Online.
	client.user.setUsername("LunaBot"); //Definir nombre de usuario, por si acaso.
	//client.user.setNickname("Luna");
	console.log('Conectado como "' + client.user.tag + '", a las ' + getTime(startDateTime) + " del " + getDate(startDateTime) + "."); //Se reporta en consola el acceso.
});

//Bot listo.
client.on('message', message => {
	//Se inicializa FunctionHandler.
	const functions = require("./function-handler.js");
	const FunctionsKit = new functions(client);

	//Se verifica que exista el prefijo completo en el mensaje.
	const supposedPrefix = message.content.slice(0, prefix.length).trim();

	const args = message.content.slice(prefix.length).trim().split(/ +/g);

	const command = args.shift().toLowerCase();

	const content = args.join(" ");

	if (message.author.bot) {
		return;
	} else {
		if (supposedPrefix === prefix) {
			/*
			Para verificar si un comando tiene argumentos.
			if (!args) {
				return message.channel.send("Introduzca algunos parámetros");
			}
			*/
			if (command !== "") {
				if (command === "help") {
					//console.log(args + "\n" + content);

					if (content === "") {
						message.channel.send("**Lista de Comandos:**\n```\nhelp\nflip\nroll\ninfo\nsay```");
					} else {}
				}

				if (command === "flip") {
					var randomNumber = 0;
					randomNumber = FunctionsKit.getRandomInt(1, 2);

					if (randomNumber === 1) {
						message.channel.send("Ha salido **cara**.");
					} else {
						if (randomNumber === 2) {
							message.channel.send("Ha salido **escudo**.");
						} else {
							message.channel.send("**ERROR:** Contactar administrador.");
						}
					}
				}

				if (command === "roll") {
					if (content === "") {
						message.channel.send("Se debe usar el formato `XdY`, donde X es la cantidad de dados a tirar, y Y su cantidad de caras.");
					} else {
						var test = /(?!.*\s)([dD])(?!.*\s)/.exec(content);
						var dies = content.split(test[0])[0];
						var faces = content.split(test[0])[1];

						if (test[0].toLowerCase() !== "d") {
							message.channel.send("Se debe utilizar una ´d´ entre la cantidad de dados y las caras de los mismos.");
						} else {
							if (dies < 1) {
								message.channel.send("Debes usar al menos **un dado**.");
							} else {
								if (faces < 1) {
									message.channel.send("Los dados deben tener al menos **una cara**.");
								} else {
									var mensaje = "*R/* ";
									var suma = 0;
									var kitDies = [];

									for (var i = 0; i < dies; i++) {
										kitDies[i] = FunctionsKit.getRandomInt(1, faces);
									}

									for (var x = 0; x < kitDies.length; x++) {
										if (x === kitDies.length - 1) {
											mensaje = mensaje + kitDies[x];
										} else {
											mensaje = mensaje + kitDies[x] + " + ";
										}

										suma = suma + Number(kitDies[x]);
									}

									mensaje = mensaje + " = " + "**" + suma + "**";

									message.channel.send(mensaje);
								}
							}
						}
						//console.log("Cantidad: " + quantity + "\n" + "Lados: " + dices);
					}
				}

				if (command === "calc") {
					message.channel.send("*Esta función se encuentra en desarrollo.*");
				}

				if (command === "info") {
					const embed = new Discord.RichEmbed();

					embed.setTitle("luna-bot");
					embed.setDescription("*Another bot for Discord. Hoping to being able to do a lot of incredible functions. Homemade. Hosted in Heroku.*");
					embed.setURL("https://github.com/estebanDT30/luna-bot");
					embed.setColor(10197915);
					embed.setImage("https://raw.githubusercontent.com/estebanDT30/luna-bot/master/docs/assets/media/img/luna-bot_cover.jpg");
					embed.setAuthor("GameBoy0665", "https://cdn.discordapp.com/avatars/288032600705204225/5a2f0058bb867eeb8699e78911981a1c.jpg", "https://github.com/estebanDT30");

					message.channel.send(embed);
				}

				if (command === "say") {
					//console.log(args + "\n" + content);
					if (content === "") {
						message.channel.send("Se debe especificar el contenido del mensaje.");
					} else {
						message.channel.send(content);
					}
				}

				if (command === "nick") {
					message.guild.members.get(client.user.id).setNickname("Luna");
				}

				if (command === "kill") {
					client.destroy();
				}
			} else {
				return;
			}
		} else {
			if (message.content !== "") {
				const botID = client.user.id;

				if (message.content === "<@" + botID + ">" || message.content === "<@!" + botID + ">") {
					message.channel.send("**Mi prefijo en este servidor es:** " + "`" + prefix + "`");
				}
			} else {
				return;
			}
		}
	}
});

//Conectar a bot.
client.login(token);