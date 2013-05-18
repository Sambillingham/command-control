
var app = require("./app"),
    mqttController = require("./mqttcontroller"),
    selectButtons = require("./selectbutton"),
    removeMessage = require("./removemessage"),
    helper = require("./helper"),
    pointsSystem = require("./pointssystem"),
    levelSystem = require("./levelsystem");

var waitingFor = [],
    waitingForValue = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 },
    whichcClientWanted = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 },
    timeOutIds = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 },
    messages = {"sent": 0},
    messageTime = { "min" : 3750 , "range" : 4000 };


function messageReady () {

    var preparedMessage = selectButtons.newInstruction();

        while ( helper.checkArray( waitingFor , preparedMessage[1]) === true ) {

            preparedMessage = selectButtons.newInstruction();
            console.log("duplicated instruction chosen re picking...");

        }

         var messageToSend = preparedMessage[0],
                inputId = preparedMessage[1], //id of input eg button5, rotary2
                buttonType = preparedMessage[2],
                newState = preparedMessage[3].toString(),
                randomPlayer = Math.floor(Math.random() * (3) + 0 );
                randomMillis = Math.floor(Math.random() * (4150) + 3750),
                clientSent = "client" + randomPlayer.toString(),
                instruction = { "message" : messageToSend , "timer" : randomMillis, "reset" : false };



        if ( app.activeClients[clientSent] !== true ) { // Stops messages being sent if player already has a message on screen


            if (buttonType != "button" ){

                waitingForValue[inputId] = newState;

            }

            waitingFor.push(inputId);// add input to the waitingFor Array
        
            whichcClientWanted[inputId] = randomPlayer; // saves which player recived the message for that input

            app.io.sockets.socket(app.clients[randomPlayer]).emit('instruction', instruction ); // emits message to the specified player
            app.activeClients[clientSent] = true; // ensures we know that player currently has a message
            messages.sent = messages.sent + 1;    // add one to the number of sent messages

            timeOutIds[inputId] = setTimeout( function () {

                                    removeMessage.checkPlayerAndRemove( inputId );
                                    pointsSystem.losePoints(1);
                                    console.log("NO input for : ", inputId ,":: Out of TIME ::");

                                }, randomMillis );

        } else {

            console.log("No message was sent this cycle, client already has a message");
        }

}

exports.waitingFor = waitingFor;
exports.waitingForValue = waitingForValue;
exports.whichcClientWanted = whichcClientWanted;
exports.timeOutIds = timeOutIds;
exports.messageReady = messageReady;
exports.messages = messages;
exports.messageTime = messageTime;