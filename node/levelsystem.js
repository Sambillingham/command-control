var app = require("./app"),
	names = require("./names"),
	messageController = require("./messagecontroller"),
	pointsSystem = require("./pointssystem");

	var levelRunning = 0,
		currentInstNum = 0,
		level = { "active" : false }
		stats = { "levels": 0 , "switches" : 0, "sliders" : 0, "rotarys" : 0 };

function startGame () {

	engageLevel(30);
}


function engageLevel ( numOfInstruct ) {

    console.log('Engaging Level');
    level.active = true;

    names.setButtonNames( "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle");

    setTimeout( function () {

    	(function () {

        messageController.messageReady();
        console.log("Array of items being watched", messageController.waitingFor);

        console.log ( "AIM", numOfInstruct);
        console.log("Current", messageController.messages.sent);

	    levelRunning = setTimeout(arguments.callee, 1000);

	    if (messageController.messages.sent >= numOfInstruct ){

        	console.log("REACHED LEVEL MAX <___>");
        	stopLevel();
        	//stopLevel();
        }
	    })();


	}, 5000);  

}
function stopLevel () {

	level.active = false;
	clearTimeout(levelRunning);
}

function endGame () {
	console.log(stats);
	stopLevel();
	app.io.sockets.emit('end-game', true);

}


exports.startGame = startGame;
exports.stopLevel = stopLevel;
exports.endGame = endGame;
exports.level = level;
exports.currentInstNum = currentInstNum;
exports.stats = stats;