//Generar un número al azar.
function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//Constantes de desarrollo.
const { prefix, token, userID, ownerID } = require("./assets/vars/config.json"); //Importación de variables.
const Discord = require("discord.js"); //Importación de "discord.js".
const client = new Discord.Client(); //Se crea una sesión.

//Arranque de bot.
client.on("ready", () => { 
	client.user.setUsername("LunaBot"); //Definir nombre de usuario, por si acaso.
	//client.user.setNickname("Luna");
	console.log("Conectado como " + client.user.tag); //Se reporta en consola el acceso.
});

//Bot listo.
client.on('message', message => { 
	/*
	Supongamos que tenemos el siguiente comando: "/saludo Me llamo Nakido".

	- En la primera variable (args), obviamente lo primero que hacemos es tomar el contenido del mensaje.

		- Con 'slice()' estamos cortando del mensaje nuestro prefijo, si nuestro prefijo es "/", un prefijo de solo un caracter, 'prefix.length' solo sería 1, por lo tanto el comando pasaría a ser solo "saludo".
\
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
	}
	else {
		/*
		Para verificar si un comando tiene argumentos.
		if (!args) {
			return message.channel.send("Introduzca algunos parámetros");
		}
		*/

		if (command === "help") {
			if (!args) {
				return message.channel.send(
					"Lista de Comandos: " +
					"\n```" +
					"\nhelp" +
					"\nflip" +
					"\nroll" +
					"\nping" +
					"\nsay" +
					"```"
				);
			}
			else {
				
			}
		}

		if (command === "flip") {
			var randomNumber = 0;
			randomNumber = getRndInt(1, 2);

			if (randomNumber === 1) {
				message.channel.send("Ha salido **cara**.");
			}
			else {
				if (randomNumber === 2) {
					message.channel.send("Ha salido **escudo**.");
				}
				else {
					message.channel.send("ERROR: Contactar administrador.");
				}
			}
		}

		if (command === "roll") {
			
		}

		if (command === "ping") {
			message.channel.send("Pong.");
		}

		if (command === "say") {
			console.log(args);
			message.channel.send(content);
		}

		if (command === "nick") {
			message.guild.members.get(client.user.id).setNickname("Luna");
		}

		if (command === "kill") {
			client.destroy();
		}
	}

	


	
})

client.login(token);