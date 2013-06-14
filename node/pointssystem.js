var app = require("./app"),
	levelSystem = require("./levelsystem"),
	pubClient = require("./mqttpubclient");

var shipHealth = { "max" : 50 , "currentH": 50 },
	maxIncreaseAmmount = 16;

function losePoints ( ammount ) {

	var lostPoints = ammount;

	shipHealth.currentH = shipHealth.currentH - lostPoints;

	app.io.sockets.emit('health', shipHealth);
	publishHealth();

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
	publishHealth();
	app.io.sockets.emit('health', shipHealth);
}

function resetShip () {

	shipHealth.currentH = shipHealth.max;
	publishHealth();
}

function publishHealth () {

	 if ( shipHealth.currenctH == (shipHealth.max*1) ) {

	 	pubClient.publishOnClient("health5", 1);
	 	

	 } else if ( shipHealth.currentH <= (shipHealth.max*0.8) && shipHealth.currentH > shipHealth.max*0.6) {

	 	pubClient.publishOnClient("health4", 1);

	 } else if ( shipHealth.currentH <= (shipHealth.max*0.6) && shipHealth.currentH > shipHealth.max*0.4) {

	 	pubClient.publishOnClient("health3", 1);

	 } else if ( shipHealth.currentH <= (shipHealth.max*0.4) && shipHealth.currentH > shipHealth.max*0.2) {

	 	pubClient.publishOnClient("health2", 1);

	 } else if ( shipHealth.currentH <= (shipHealth.max*0.2) ) {

	 	pubClient.publishOnClient("health1", 1);
	 }
}

exports.losePoints = losePoints;
exports.gainPoints = gainPoints;
exports.resetShip = resetShip;