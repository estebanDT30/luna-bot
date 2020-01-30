const express = require("express");
const app = express();

//SET PORT
const port = process.env.PORT || 4000;

//SET DIRECTORIES
app.use(express.static(__dirname + "/docs"));
app.use(express.static(__dirname + "/docs/assets"));

//ROUTES
app.get("/", function(req, res) {
	res.render("/");
});

app.use(function(req, res, next) {
	res.status(404).send("Error 404. Page not found.");
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send("Unknown error. Check console for details.");
});

app.listen(port, function() {
	console.log("Servidor web iniciado en el puerto " + port + ".");
});
