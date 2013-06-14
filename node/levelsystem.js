var app = require("./app"),
    names = require("./names"),
    messageController = require("./messagecontroller"),
    pointsSystem = require("./pointssystem"),
    helper = require("./helper");

    var levelRunning = 0,
        currentInstNum = 0,
        level = { "active" : false },
        stats = { "levelsCompleted": 0 , "pots" : 0,  "switches" : 0 },
        levelSpeed = 900;

function startGame () {

    engageLevel(1);
}


function engageLevel ( levelNum ) {

    var lowerBound = 7 + ( 50 * (stats.levelsCompleted/10));
        upperBound = 17 + (60 * (stats.levelsCompleted/10));

    numOfInstruct = helper.findRandom(lowerBound,upperBound);

    console.log('Engaging Level : ' , levelNum );
    app.io.sockets.emit('new-level' , levelNum);

    level.active = true;

    names.setButtonNames();

    setTimeout( function () {

        (function () {

        messageController.messageReady();
        //console.log("Array of items being watched", messageController.waitingFor);

        console.log ( "Number of instructions in level : ", numOfInstruct);
        console.log("Number of instructions sent : ", messageController.messages.sent);

        levelRunning = setTimeout(arguments.callee, levelSpeed);

        if ((messageController.messages.sent  + 3 ) >= numOfInstruct ){

            console.log(">>>> LEVEL ", levelNum," COMPLETED <<<<");
            stopLevel();
            stats.levelsCompleted = stats.levelsCompleted + 1;
            
            nextLevel(stats.levelsCompleted);
        }
        })();


    }, levelDelay() );  

}
function stopLevel () {

    level.active = false;
    messageController.messages.sent = 0;
    clearTimeout(levelRunning);
}

function nextLevel (completedLevel) {

    var nextLevel = completedLevel + 1;
        healthIncrease = (completedLevel/2)*30;


        messageController.messageTime.range = messageController.messageTime.range - ((messageController.messageTime.range/100)*4);
        messageController.messageTime.min = messageController.messageTime.min - ((messageController.messageTime.min/100)*2);
        levelSpeed = levelSpeed - ((levelSpeed/100)*7)
        pointsSystem.gainPoints(healthIncrease);

        engageLevel(nextLevel);
}



function endGame () {

    levelSpeed = 900;
    // messageController.messageTime.range = 4000;
    // messageController.messageTime.min = 3750;
    pointsSystem.resetShip();
    console.log(stats);
    stopLevel();
    app.io.sockets.emit('end-game', true);
    // stats.levelsCompleted = 0;
    // stats.pots = 0;
    // stats.switches = 0;
}

function fakeEnd () {

    pointsSystem.resetShip();
    stopLevel();

}

function levelDelay () {

    if ( stats.levelsCompleted >= 1) {

        return 10000;

    } else {

        return 20000;
    }
}

exports.startGame = startGame;
exports.stopLevel = stopLevel;
exports.endGame = endGame;
exports.level = level;
exports.currentInstNum = currentInstNum;
exports.stats = stats;
exports.fakeEnd = fakeEnd;