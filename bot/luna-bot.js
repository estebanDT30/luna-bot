//Usar las variables de entorno.
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.DISCORD_PREFIX;

//Constantes de desarrollo.
const Discord = require("discord.js"); //Importación de "discord.js".
const client = new Discord.Client(); //Se crea una sesión.

//Generar un número al azar.
function getRndInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Arranque de bot.
client.on("ready", () => {
	client.user.setUsername("LunaBot"); //Definir nombre de usuario, por si acaso.
	//client.user.setNickname("Luna");
	console.log("Conectado como " + client.user.tag); //Se reporta en consola el acceso.
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
		return ;
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
						message.channel.send("**Lista de Comandos:**\n```\nhelp\nflip\nroll\nrepo\nsay```");
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
									var kitDies = new Array;

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

				if (command === "repo") {
					message.channel.send("**https://github.com/estebanDT30/luna-bot**");
				}

				if (command === "say") {
					//console.log(args + "\n" + content);
					if (content === "") {
						message.channel.send("Se debe especificar el contenido del mensaje.");
					}
					else {
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
				message.channel.send("El prefijo es: `" + prefix + "`.");
			}
		} else {
			return ;
		}
	}
});

//Depurar errores.
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));

//Conectar a bot.
client.login(token);