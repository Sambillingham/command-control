var app = require("./app"),
	levelSystem = require("./levelsystem");

var shipHealth = { "max" : 30 , "currentH": 30 };

function losePoints ( ammount ) {

	var lostPoints = ammount;

	shipHealth.currentH = shipHealth.currentH - lostPoints;

	app.io.sockets.emit('health', shipHealth);
}

exports.losePoints = losePoints;