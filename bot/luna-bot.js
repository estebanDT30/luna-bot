//Usar las variables de entorno.
require('dotenv').config();

//Constantes de entorno.
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.DISCORD_PREFIX;
const ownerID = process.env.DISCORD_DEV_ID;

//Constantes de desarrollo.
const Discord = require("discord.js"); //Importación de "discord.js".
const client = new Discord.Client(); //Se crea una sesión.

//Generar un número al azar.
function getRndInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Obtener el objeto "Usuario", es decir, yo, el dueño del bot.
function getBotOwner(id) {
	if (id !== "") {
		var user = client.fetchUser(id);
	} else {
		console.log('ERROR en la función "getBotOwner": No se ha definido el ID del Usuario a buscar.');
	}

	if (user != null) {
		return user;
	} else {
		console.log('ERROR en la función "getBotOwner": No se ha encontrado ningún usuario en base al ID especificado.');
	}
}

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
}

//Arranque de bot.
client.on("ready", () => {
	const startDateTime = client.readyAt;

	client.user.setStatus("online"); //Definir estado Online.
	client.user.setUsername("LunaBot"); //Definir nombre de usuario, por si acaso.
	//client.user.setNickname("Luna");
	console.log('Conectado como "' + client.user.tag + '", a las ' + getTime(startDateTime) + "del " + getDate(startDateTime) + "."); //Se reporta en consola el acceso.
});

//Bot listo.
client.on('message', message => {
	//Se verifica que exista el prefijo completo en el mensaje.
	const supposedPrefix = message.content.slice(0, prefix.length).trim();

	/*
	Supongamos que tenemos el siguiente comando: "/saludo Me llamo Nakido".

	- En la primera variable (args), obviamente lo primero que hacemos es tomar el contenido del mensaje.
		- Con 'slice()' estamos cortando del mensaje nuestro prefijo, si nuestro prefijo es "/", un prefijo de solo un caracter, 'prefix.length' solo sería 1, por lo tanto el comando pasaría a ser solo "saludo".
		- 'trim()' elimina todos los espacios adicionales que puedan haber antes y después del mensaje.
		- 'split(/ +/g)' separaría el mensaje por sus espacios dejando solo un array (utilizamos RegExp en lugar de solo un espacio en caso de que haya un espacio adicional entre palabras, error muy común en los que acostumbramos a usar Discord en celular), de esta manera nos quedaría ["saludo", "Me", "llamo", Nakido]
	*/

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	/*
	- 'command' sería lo que usaremos luego para agregar comandos.
		- 'args.shift()' separaría el comando del resto del mensaje ('shift()' remueve el primer objeto de un array), de esta manera 'args' solo quedaría como el resto del contenido del mensaje (["Me", "llamo", Nakido]) y lo podremos utilizar para definir parámetros adicionales en nuestros comandos.
		- 'toLowerCase()' haría que todo el comando estuviera en minúsculas, así en caso de que nos equivoquemos escribiendo el comando y pongamos algo como /Saludo, funcionaría igual.
	*/

	const command = args.shift().toLowerCase();
	/*
	- 'content' sería similar a 'args', solo que en lugar de tener un array, sería un string.
		- 'join(" ")' es la función que se encarga de unir todos los elementos del array con espacios en un string.
	*/

	const content = args.join(" ");

	/*
	Ahora intentemos algo más complicado.

	if (command === "presentacion") {
		const nombre = args[0];
		const edad = args[1];
		const pais = args[2];
		message.channel.send("Hola, mi nombre es " + nombre + ", tengo " + edad + " años y actualmente vivo en " + pais);
	}

	// Desestructuración de arrays en ES6
	if (command === "presentacion") {
		const [nombre, edad, pais] = args;
			message.channel.send("Hola, mi nombre es " + nombre + ", tengo " + edad + " años y actualmente vivo en " + pais);
	}

	Si utilizamos el comando de la siguiente manera: /presentacion Daniel 22 Venezuela, el bot enviaría "Hola, mi nombre es Daniel, tengo 22 años y actualmente vivo en Venezuela".
	Bastante útil, pero ahora te toca a ti crear tus propios comandos.
	*/

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
					randomNumber = getRndInt(1, 2);

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
										kitDies[i] = getRndInt(1, faces);
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
					embed.setImage("https://raw.githubusercontent.com/estebanDT30/luna-bot/master/docs/assets/media/img/luna_cover.png");
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

//Depurar errores.
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));

//Conectar a bot.
client.login(token);