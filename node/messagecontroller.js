
var app = require("./app"),
    mqttController = require("./mqttcontroller"),
    selectButtons = require("./selectbutton"),
    removeMessage = require("./removemessage"),
    helper = require("./helper"),
    pointsSystem = require("./pointssystem"),
    levelSystem = require("./levelsystem");

var waitingFor = [],
    waitingForValue = { "rocker0" : 99 , "rocker1" : 99, "rocker2" : 99, "rocker3" : 99, "rocker4" : 99, "rocker5" : 99, "rocker6" : 99,
                    "rocker7" : 99, "toggle0" : 99, "toggle1" : 99, "toggle2" : 99, "toggle3" : 99, "toggle4" : 99, "slider0" : 99,
                    "slider1" : 99, "slider2" : 99, "slider3" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "rotary3" : 99,
                    "ultrasound0" : 99, "keySwitch0" : 99, "redButton0" : 99, "missileSwitch0" : 99 },
    whichClientWanted = { "rocker0" : 99 , "rocker1" : 99, "rocker2" : 99, "rocker3" : 99, "rocker4" : 99, "rocker5" : 99, "rocker6" : 99,
                    "rocker7" : 99, "toggle0" : 99, "toggle1" : 99, "toggle2" : 99, "toggle3" : 99, "toggle4" : 99, "slider0" : 99,
                    "slider1" : 99, "slider2" : 99, "slider3" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "rotary3" : 99,
                    "ultrasound0" : 99, "keySwitch0" : 99, "redButton0" : 99, "missileSwitch0" : 99 },
    timeOutIds = { "rocker0" : 0 , "rocker1" : 0, "rocker2" : 0, "rocker3" : 0, "rocker4" : 0, "rocker5" : 0, "rocker6" : 0,
                    "rocker7" : 0, "toggle0" : 0, "toggle1" : 0, "toggle2" : 0, "toggle3" : 0, "toggle4" : 0, "slider0" : 0,
                    "slider1" : 0, "slider2" : 0, "slider3" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "rotary3" : 0,
                    "ultrasound0" : 0, "keySwitch0" : 0, "redButton0" : 0, "missileSwitch0" : 0 },
    messages = {"sent": 0},
    messageTime = { "min" : 5150 , "range" : 4750 };


function messageReady () {

        var randomPlayer = 0,
            preparedMessage = "";

        if ( app.clients.length > 0 ) {

                preparedMessage = selectButtons.newInstruction();

            while ( helper.checkArray( waitingFor , preparedMessage[1]) === true ) {

                console.log("duplicated instruction chosen re-creating...");
                preparedMessage = selectButtons.newInstruction();   

            }

        var messageToSend = preparedMessage[0],
            inputId = preparedMessage[1], //id of input eg button5, rotary2
            buttonType = preparedMessage[2],
            newState = preparedMessage[3].toString();

            if ( app.clients.length === 1 ) {

                randomPlayer = 0;

            } else {

                randomPlayer = Math.floor(Math.random() * (app.clients.length) + 0 );
            }

            var randomMillis = Math.floor(Math.random() * (10000) + 8750),
                instruction = { "message" : messageToSend , "timer" : randomMillis, "reset" : false };

            whichClientWanted[inputId] = app.clients[randomPlayer]; // saves which player recived the message for that input
            app.io.sockets.socket(app.clients[randomPlayer]).emit('instruction', instruction ); // emits message to the specified player
            app.clients.splice((app.clients.indexOf(app.clients[randomPlayer])),1);
            waitingFor.push(inputId);// add input to the waitingFor Array
            
            if (buttonType != "toggle" || buttonType != "rocker" ){

                waitingForValue[inputId] = newState;

            }

            messages.sent = messages.sent + 1;    // add one to the number of sent messages

            timeOutIds[inputId] = setTimeout( function () {

                                    removeMessage.checkPlayerAndRemove( inputId );
                                    pointsSystem.losePoints(1);
                                    console.log("NO input for : ", inputId ,":: Out of TIME ::");

                                }, randomMillis );

        }

}

exports.waitingFor = waitingFor;
exports.waitingForValue = waitingForValue;
exports.whichClientWanted = whichClientWanted;
exports.timeOutIds = timeOutIds;
exports.messageReady = messageReady;
exports.messages = messages;
exports.messageTime = messageTime;