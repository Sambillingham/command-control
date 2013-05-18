var app = require("./app"),
    names = require("./names"),
    messageController = require("./messagecontroller"),
    pointsSystem = require("./pointssystem"),
    helper = require("./helper");

    var levelRunning = 0,
        currentInstNum = 0,
        level = { "active" : false },
        stats = { "levelsCompleted": 0 , "switches" : 0, "sliders" : 0, "rotarys" : 0 },
        levelSpeed = 900;

function startGame () {

    engageLevel(1);
}


function engageLevel ( levelNum ) {

    var lowerBound = 24 + ( 30 * (stats.levelsCompleted/10));
        upperBound = 34 + (40 * (stats.levelsCompleted/10));

    numOfInstruct = helper.findRandom(lowerBound,upperBound);

    console.log('Engaging Level : ' , levelNum );
    app.io.sockets.emit('new-level' , levelNum);

    level.active = true;

    names.setButtonNames( "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle");

    setTimeout( function () {

        (function () {

        messageController.messageReady();
        //console.log("Array of items being watched", messageController.waitingFor);

        console.log ( "Number of instructions in level : ", numOfInstruct);
        console.log("Number of instructions sent : ", messageController.messages.sent);

        levelRunning = setTimeout(arguments.callee, levelSpeed);

        if ((messageController.messages.sent  - 3) >= numOfInstruct ){

            console.log(">>>> LEVEL ", levelNum," COMPLETED <<<<");
            stopLevel();
            stats.levelsCompleted = stats.levelsCompleted + 1;
            
            nextLevel(stats.levelsCompleted);
        }
        })();


    }, 5000);  

}
function stopLevel () {

    level.active = false;
    messageController.messages.sent = 0;
    clearTimeout(levelRunning);
}

function nextLevel (completedLevel) {

    var nextLevel = completedLevel + 1;
        healthIncrease = (completedLevel/10)*30;

        levelSpeed = levelSpeed - ((levelSpeed/100)*7)
        pointsSystem.gainPoints(healthIncrease);

        engageLevel(nextLevel);
}

function endGame () {

    levelSpeed = 900;
    messageController.messageTime.range = 4000;
    messageController.messageTime.min = 3750;
    pointsSystem.resetShip();
    console.log(stats);
    stopLevel();
    app.io.sockets.emit('end-game', stats);

}


exports.startGame = startGame;
exports.stopLevel = stopLevel;
exports.endGame = endGame;
exports.level = level;
exports.currentInstNum = currentInstNum;
exports.stats = stats;