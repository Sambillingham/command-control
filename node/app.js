var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false });
    // mqtt = require('mqttjs');

    var socketsPort = 8080,
        mqttPort = 8085, // need to be diffrent to socketsPort
        serverAddress = "127.0.0.1";

        // Export earlier for mqqt client to connect on startup
        exports.serverAddress = serverAddress;
        exports.mqttPort = mqttPort;

    var clients = [],
        //topicDouble = { "button0" : false, "button1" : false, "button2" : false, "button3" : false, "button4" : false, "button5" : false, "button6" : false, "button7" : false, "slider0" : false, "slider1" : false, "slider2" : false, "rotary0" : false, "rotary1" : false, "rotary2" : false, "ultrasound1" : false, "ultrasound2" : false },
        timeOutIds = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };

    var buttonMap = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };

    var waitingFor = [],
        waitingForValue = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 },
        whichcClientWanted = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 };

    var activeClients = { "client0" : false , "client1" : false , "client2" : false };

    var connectedPlayers = { "player1" : false , "player2" : false , "player3" : false };

    var resetInstruction = { "message" : "" , "timer" : "" , "reset" : true };

       //Modules
    var mqqtclient = require("./mqttclient"),
        selectButtons = require("./selectbutton"),
        names = require("./names"),
        mqttBroker = require("./mqttbroker");
        //mqttsubclient = require("./mqttsubclient");

server.listen(socketsPort);

app.configure(function() {

        app.use(express.static(__dirname + '/public'));
});
app.get('/', function (req, res) {

        res.sendfile(__dirname + '/index.html');
});
app.get('/player1', function (req, res) {

        res.sendfile(__dirname + '/player1.html');
});
app.get('/player2', function (req, res) {

        res.sendfile(__dirname + '/player2.html');
});
app.get('/player3', function (req, res) {

        res.sendfile(__dirname + '/player3.html');
});
app.get('/controls', function (req, res) {

        res.sendfile(__dirname + '/control.html');
});



    io.sockets.on('connection', function (socket) {

            socket.on('playerID', function (id) {

                socket.set('nickname', id);

                if ( id == "player1" || id == "player2" || id == "player3" ) {

                    connectedPlayers[id] = true;
                    console.log("connected : ", connectedPlayers);

                } else {

                    socket.disconnect();
                }

            });

            clients.push(socket.id);
            console.log("clients: ", clients);

            socket.on('start', function () {

                console.log("Start Recivied");
                engageLevel();


            });

            socket.on('disconnect', function () {

                var toDC = 0;

                socket.get('nickname', function (err, nickname) {

                    connectedPlayers[nickname] = false;

                });

                toDC = clients.indexOf(socket.id);
                clients.splice(toDC, 1);


            });

      });

function mqttKeepAlive (keepAliveTimer) {

    (function () {

        mqqtclient.publishOnClient("1/keepAlive" , "1");


    setTimeout(arguments.callee, keepAliveTimer);

    })();
}

function mqttController (id, topic, packet) {

    var incommingTopic = topic + "",
        waitingTopicPos = 0,
        buttonType = incommingTopic.slice(0, -1);

    mqttBroker.topicDouble[topic] = false;

    console.log("ID: ", id, "TOPIC: ", topic, "PACKET: ", packet);

    console.log( " incomming topic: ", incommingTopic );
    console.log("Array of items being watched", waitingFor);

    if ( checkArray(waitingFor, incommingTopic) === true ) {

        console.log( incommingTopic, ":  item was found in array");
        console.log( "Type of input is: --> ", buttonType, "  <--");

        if ( buttonType == "button") {

        // waitingTopicPos = waitingFor.indexOf(topic);
        // waitingFor.splice(topic, 1);

        checkPlayerAndRemove(topic);
        console.log("Button was accepted");

        } else {

            if ( packet === waitingForValue[topic]) {

                console.log("slider/rotary was accepted");
                checkPlayerAndRemove(topic );

            } else {
                console.log("Wrong roatry/slider value. !Rejected!");
                losePoints(1);
            }

        }

    } else {
        console.log("Wrong switch. !Rejected!");
        losePoints(1);// wrong button pressed (aka not found in waiting for array)
    }

    switch ( topic ) {

        case "button0" :
            buttonMap.button0 = packet;
        break;
        case "button1" :
            buttonMap.button1 = packet;
        break;
        case "button2" :
            buttonMap.button2 = packet;
        break;
        case "button3" :
            buttonMap.button3 = packet;
        break;
        case "button4" :
            buttonMap.button4 = packet;
        break;
        case "button5" :
            buttonMap.button5 = packet;
        break;
        case "button6" :
            buttonMap.button6 = packet;
        break;
        case "button7" :
            buttonMap.button7 = packet;
        break;
        case "slider0" :
            buttonMap.slider0 = packet;
        break;
        case "slider1" :
            buttonMap.slider1 = packet;
        break;
        case "slider2" :
            buttonMap.slider2 = packet;
        break;
        case "rotary0" :
            buttonMap.rotary0 = packet;
        break;
        case "rotary1" :
            buttonMap.rotary1 = packet;
        break;
        case "rotary2" :
            buttonMap.rotary2 = packet;
        break;
        // case "ultrasound1" :
        //     buttonMap.ultrasound1 = packet;
        // break;
        // case "ultrasound2" :
        //     buttonMap.ultrasound2 = packet;
        // break;


    }
    //console.log(buttonMap);
    io.sockets.emit('map', buttonMap);


}

function engageLevel () {

    console.log('Engaging Level');

    names.setButtonNames( "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle");

    (function () {


        messageReady();
        console.log("Array of items being watched", waitingFor);

    setTimeout(arguments.callee, 1000);

    })();



}
function messageReady () {

        //console.log("Making message...");

    var preparedMessage = selectButtons.newInstruction();

        while ( checkArray( waitingFor , preparedMessage[1]) === true ) {

            preparedMessage = selectButtons.newInstruction();

        }
        //console.log(preparedMessage);

    var messageToSend = preparedMessage[0],
        inputId = preparedMessage[1], //id of input eg button5, rotary2
        buttonType = preparedMessage[2],
        newState = preparedMessage[3].toString(),
        randomPlayer = Math.floor(Math.random() * (3) + 0 );
        randomMillis = Math.floor(Math.random() * (4150) + 3750);
        clientSent = "client" + randomPlayer.toString(),
        instruction = { "message" : messageToSend , "timer" : randomMillis, "reset" : false };

        
        //console.log( "random Millis : ", randomMillis);
        //console.log( "client to send to :  ", clientSent);

        //console.log("List of active clients: ", activeClients);

        if ( activeClients[clientSent] != true ) { // Stops messages being sent if player already has a message on screen


            if (buttonType != "button" ){

                waitingForValue[inputId] = newState;

            }

            waitingFor.push(inputId);
        
            whichcClientWanted[inputId] = randomPlayer;

            io.sockets.socket(clients[randomPlayer]).emit('instruction', instruction );
            activeClients[clientSent] = true;

            timeOutIds[inputId] = setTimeout( function () {

                                    checkPlayerAndRemove( inputId );
                                    console.log("Out of time no input for, ", inputId ," Recivied!!");

                                }, randomMillis );

            //console.log("Array of items being watched", waitingFor);
            //console.log("new states being waited for", waitingForValue);

        }

}
function checkPlayerAndRemove ( input ) {

    var waitingTopicPos = waitingFor.indexOf(input),
        whichClient = "client" + whichcClientWanted[input].toString();

        clearTimeout(timeOutIds[input]);

        io.sockets.socket(clients[whichcClientWanted[input]]).emit('instruction', resetInstruction );

        activeClients[whichClient] = false;

        waitingFor.splice(waitingTopicPos, 1);
        
        waitingForValue[input] = 99;
        whichcClientWanted[input] = 99;
}
function checkArray ( arr, obj ) {

    for ( var i = 0; i < arr.length; i++ ) {

        if (arr[i] == obj)return true;

    }
}


function losePoints ( ammount ){

}


mqttKeepAlive(15000);
exports.buttonMap = buttonMap;
exports.io = io;
exports.mqttController = mqttController;
