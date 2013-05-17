var app = require("./app"),
	names = require("./names"),
	messageController = require("./messagecontroller"),
	pointsSystem = require("./pointssystem");


function engageLevel () {

    console.log('Engaging Level');

    names.setButtonNames( "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle");

    (function () {

        messageController.messageReady();
        console.log("Array of items being watched", messageController.waitingFor);

    setTimeout(arguments.callee, 1000);

    })();

}

exports.engageLevel = engageLevel;