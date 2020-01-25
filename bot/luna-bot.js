//Usar las variables de entorno.
require("dotenv").config();

//Constantes de entorno.
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.DISCORD_PREFIX;
const ownerID = process.env.DISCORD_DEV_ID;

const errorHookID = process.env.ERROR_WEBHOOK_ID;
const errorHookSecret = process.env.ERROR_WEBHOOK_SECRET;

//Constantes de desarrollo.
const Discord = require("discord.js"); //Importación de "discord.js".
const client = new Discord.Client(); //Se crea una sesión.

//Función que, como indica, permite obtener un "User" a partir de una mención.
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1);

		if (mention.startsWith("!")) {
			mention = mention.slice(1);
		}

		return client.users.get(mention);
	}
}

function getTime(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();

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

	const strTime = hours + ":" + minutes + " " + time;

	return strTime;
}

function getDate(date) {
	let day = date.getDate();
	let month = date.getMonth() + 1; //'getMonth()' retorna los meses empezando por el '0'.
	let year = date.getFullYear();

	if (day < 10) {
		day = "0" + day;
	}

	if (month < 10) {
		month = "0" + month;
	}

	const strDate = day + "/" + month + "/" + year;

	return strDate;
}

function reportError(error, message) {
	const embed = new Discord.RichEmbed();

	embed.setColor(10197915);
	embed.setTitle("<:evAnimePlsNot:654768549575000104>");
	embed.setDescription("```js\n" + error + "\n```");
	embed.setFooter("Este es un error. Por favor, ten paciencia. El desarrollador se hará cargo, eventualmente.");

	message.channel.send(embed);

	const hook = new Discord.WebhookClient(errorHookID, errorHookSecret);
	const embedLog = new Discord.RichEmbed();

	embedLog.setColor(10197915);
	embedLog.setDescription("```js\n" + error + "\n```");
	embedLog.addField("Tipo de Canal", message.channel.type, true);

	if (message.channel.type === "text") {
		embedLog.addField("Servidor", message.guild.name, true);
		embedLog.addField("Enlace", message.url);
	} else if (message.channel.type === "dm") {
		embedLog.addField("Usuario", message.author.username + "#" + message.author.discriminator, true);
	}

	hook.send(embedLog);

	console.log(error);
}

//Arranque de bot.
client.on("ready", () => {
	const startDateTime = client.readyAt;

	client.user.setStatus("online"); //Definir estado Online.
	client.user.setUsername("LunaBot"); //Definir nombre de usuario, por si acaso.
	//client.user.setNickname("Luna");
	console.log(
		'Conectado como "' +
			client.user.tag +
			'", a las ' +
			getTime(startDateTime) +
			" del " +
			getDate(startDateTime) +
			"."
	); //Se reporta en consola el acceso.
});

//Bot listo.
client.on("message", message => {
	//Se inicializa FunctionHandler.
	const functions = require("./function-handler.js");
	const FunctionsKit = new functions(client);

	//Se verifica que exista el prefijo completo en el mensaje.
	const supposedPrefix = message.content.slice(0, prefix.length).trim();

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);

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

					try {
						if (content === "") {
							message.channel.send("**Lista de Comandos:**\n```\nhelp\nflip\nroll\ninfo\nsay```");
						}
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "flip") {
					try {
						let randomNumber = 0;
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
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "roll") {
					try {
						if (content === "") {
							message.channel.send(
								"Se debe usar el formato `XdY`, donde X es la cantidad de dados a tirar, y Y su cantidad de caras."
							);
						} else {
							const regex = /(?!.*\s)([dD])(?!.*\s)/g;

							const test = regex.exec(content);
							const dies = content.split(test[0])[0];
							const faces = content.split(test[0])[1];

							if (test[0].toLowerCase() !== "d") {
								message.channel.send(
									"Se debe utilizar una ´d´ entre la cantidad de dados y las caras de los mismos."
								);
							} else {
								if (dies < 1) {
									message.channel.send("Debes usar al menos **un dado**.");
								} else {
									if (faces < 1) {
										message.channel.send("Los dados deben tener al menos **una cara**.");
									} else {
										let mensaje = "*R/* ";
										let suma = 0;
										let kitDies = [];

										for (let i = 0; i < dies; i++) {
											kitDies[i] = FunctionsKit.getRandomInt(1, faces);
										}

										for (let x = 0; x < kitDies.length; x++) {
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
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "calc") {
					try {
						message.channel.send("_Esta función se encuentra en desarrollo._");
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "info") {
					try {
						const embed = new Discord.RichEmbed();

						embed.setTitle("Luna");
						embed.setDescription(
							"_Un bot para Discord._\n_Espero que sea capaz de hacer un montón de cosas que otros bots hacen._"
						);
						//embed.setURL("https://github.com/estebanDT30/luna-bot");
						embed.setColor(10197915);
						embed.setImage(
							"https://raw.githubusercontent.com/estebanDT30/luna-bot/master/docs/assets/media/img/luna-bot_cover.jpg"
						);
						embed.setAuthor(
							"GameBoy0665",
							"https://cdn.discordapp.com/avatars/288032600705204225/5a2f0058bb867eeb8699e78911981a1c.jpg" /*, "https://github.com/estebanDT30"*/
						);
						embed.addField("Repositorio en GitHub", "https://github.com/estebanDT30/luna-bot");
						embed.addField("Perfil del Desarrollador en GitHub", "https://github.com/estebanDT30");

						message.channel.send(embed);
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "say") {
					//console.log(args + "\n" + content);

					try {
						if (content === "") {
							message.channel.send("Se debe especificar el contenido del mensaje.");
						} else {
							message.channel.send(content);
							if (
								message.channel.permissionsFor(message.guild.me).has("ADMINISTRATOR") ||
								message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")
							) {
								message.delete();
							}
						}
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "nick") {
					try {
						message.guild.members.get(client.user.id).setNickname("Luna");
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "eval") {
					try {
						if (message.author.id === ownerID) {
							if (args != "") {
								const code = args.join(" ");
								let response = eval(code);

								if (typeof response !== "string") {
									response = require("util").inspect(response, {
										depth: 0
									});
								}

								const embed = new Discord.RichEmbed();

								embed.setColor(10197915);
								embed.setTitle("<:evAnimeSip:654767584096419841>");
								embed.addField("INPUT", "```js\n" + code + "\n```");
								embed.addField("OUTPUT", "```js\n" + response + "\n```");

								message.channel.send(embed);
							} else {
								message.channel.send("Se debe especificar el código a ejecutar.");
							}
						} else {
							message.channel.send("_Va a ser que no._ <:evAnimeShrug:654768549725863936>");
						}
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "stats") {
					try {
						const uptime = client.readyAt;
						const ping = Math.round(client.ping * 100) / 100;
						const serverAmmount = client.guilds.size;
						const userAmmount = client.users.size;

						const embed = new Discord.RichEmbed();

						embed.setColor(10197915);
						embed.setTitle("<:evAnimeWhat:654768549641846824>");
						embed.addField(
							"Hora y fecha del último reinicio",
							getDate(uptime) + ", " + getTime(uptime) + "\n _GMT-6_"
						);
						embed.addField("Ping", "**" + ping + "** ms", true);
						embed.addField("Servidores", serverAmmount, true);
						embed.addField("Usuarios", userAmmount, true);

						message.channel.send(embed);
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "ygo") {
					try {
						if (content === "") {
							message.channel.send("Debes especificar el nombre de la carta a buscar.");
						} else {
							const fetch = require("node-superfetch");

							const term = content.replace(/ /g, "%20");

							fetch
								.get(`https://db.ygoprodeck.com/api/v5/cardinfo.php?fname=${term}`)
								.then(x => {
									if (x.body.length == 1) {
										const singleCardEmbed = new Discord.RichEmbed();

										singleCardEmbed.setImage(x.body[0].card_images[0].image_url);

										message.channel.send(singleCardEmbed);
									} else if (x.body.length > 1) {
										const listEmbed = new Discord.RichEmbed();

										listEmbed.setColor(10197915);
										listEmbed.setTitle("Elige una carta");

										let listEmbedContent = "";

										for (i = 0; i <= x.body.length - 1; i++) {
											counter = i + 1;
											listEmbedContent += counter + " - " + x.body[i].name + "\n";
										}

										if (listEmbedContent.length > 2048) {
											throw new Error("Too much results.");
										}

										listEmbed.setDescription("```\n" + listEmbedContent + "```");

										message.channel.send(listEmbed);

										message.channel
											.awaitMessages(
												m =>
													m.author.id === message.author.id &&
													m.content != "" &&
													m.content < x.body.length + 1,
												{
													max: 1,
													time: 30000
												}
											)
											.then(a => {
												a = a.first();
												if (!a) {
													return message.channel.send("No se recibió ninguna respuesta.");
												} else {
													const selectedCardEmbed = new Discord.RichEmbed();

													selectedCardEmbed.setImage(
														x.body[a.content - 1].card_images[0].image_url
													);

													message.channel.send(selectedCardEmbed);
												}
											});
									}
								})
								.catch(e => {
									if (e.status === 400) {
										message.channel.send(
											"No se ha encontrado ninguna carta que mencione el término que has buscado."
										);
									} else {
										reportError(e, message);
									}
								});
						}
					} catch (err) {
						reportError(err, message);
					}
				}

				if (command === "kill") {
					try {
						if (message.author.id === ownerID) {
							if (
								message.channel.permissionsFor(message.guild.me).has("ADMINISTRATOR") ||
								message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")
							) {
								message.delete();
							}
							client.destroy();
						} else {
							message.channel.send("_Va a ser que no._ <:evAnimeShrug:654768549725863936>");
						}
					} catch (err) {
						reportError(err, message);
					}
				}
			} else {
				return;
			}
		} else {
			try {
				if (message.content !== "") {
					const botID = client.user.id;

					if (message.content === "<@" + botID + ">" || message.content === "<@!" + botID + ">") {
						message.channel.send("**Mi prefijo en este servidor es:** " + "`" + prefix + "`");
					}
				} else {
					return;
				}
			} catch (err) {
				message.channel.send(reportError(err));
				console.error(err);
			}
		}
	}
});

client.on("disconnect", () => {
	client.user.setStatus("offline");
});

//Conectar a bot.
client.login(token);
