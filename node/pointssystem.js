var app = require("./app"),
	levelSystem = require("./levelsystem");

var shipHealth = { "max" : 50 , "currentH": 50 },
	maxIncreaseAmmount = 22;

function losePoints ( ammount ) {

	var lostPoints = ammount;

	shipHealth.currentH = shipHealth.currentH - lostPoints;

	app.io.sockets.emit('health', shipHealth);

	if ( shipHealth.currentH <= 0){

		levelSystem.endGame();
	}
}

function gainPoints ( ammount ) {

	if ( ammount < maxIncreaseAmmount ) {

		shipHealth.currentH = shipHealth.currentH + ammount;
	
	} else {

		shipHealth.currentH = shipHealth.currentH + maxIncreaseAmmount;

	} 

	app.io.sockets.emit('health', shipHealth);
}

function resetShip () {

	shipHealth.currentH = shipHealth.max;
}

exports.losePoints = losePoints;
exports.gainPoints = gainPoints;
exports.resetShip = resetShip;