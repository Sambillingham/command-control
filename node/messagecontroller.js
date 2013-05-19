
var app = require("./app"),
    mqttController = require("./mqttcontroller"),
    selectButtons = require("./selectbutton"),
    removeMessage = require("./removemessage"),
    helper = require("./helper"),
    pointsSystem = require("./pointssystem"),
    levelSystem = require("./levelsystem");

var waitingFor = [],
    waitingForValue = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 },
    whichClientWanted = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 },
    timeOutIds = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 },
    messages = {"sent": 0},
    messageTime = { "min" : 3750 , "range" : 4000 };


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

            var randomMillis = Math.floor(Math.random() * (4150) + 3750),
                instruction = { "message" : messageToSend , "timer" : randomMillis, "reset" : false };

            whichClientWanted[inputId] = app.clients[randomPlayer]; // saves which player recived the message for that input
            app.io.sockets.socket(app.clients[randomPlayer]).emit('instruction', instruction ); // emits message to the specified player
            app.clients.splice((app.clients.indexOf(app.clients[randomPlayer])),1);
            waitingFor.push(inputId);// add input to the waitingFor Array
            
            if (buttonType != "button" ){

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