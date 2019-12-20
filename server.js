var express = require("express");
var app = express();

//SET PORT
var port = process.env.PORT || 8080;
app.use(express.static(__dirname + "/docs"));

//ROUTES
app.get("/", function(req, res) {
	res.render("index");
});

app.listen(port, function() {
	console.log("Servidor web iniciado en el puerto " + port + ".");
});
