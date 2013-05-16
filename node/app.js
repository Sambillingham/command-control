var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false }),
    mqtt = require('mqttjs');

    socketsPort = 8080,
    mqttPort = 8085, // need to be diffrent to socketsPort
    serverAddress = "127.0.0.1";

    var clients = [],
        clientHasMessage = { "player1" : false , "player2" : false , "player3" : false };

    var topicDouble = { "button0" : false, "button1" : false, "button2" : false, "button3" : false, "button4" : false, "button5" : false, "button6" : false, "button7" : false, "slider0" : false, "slider1" : false, "slider2" : false, "rotary0" : false, "rotary1" : false, "rotary2" : false, "ultrasound1" : false, "ultrasound2" : false };
    var timeOutIds = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };
    


    var buttonMap = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };
    var buttonNames = { "button0" : "0", "button1" : "0", "button2" : "0", "button3" : "0", "button4" : "0", "button5" : "0", "button6" : "0", "button7" : "0", "slider0" : "0", "slider1" : "0", "slider2" : "0", "rotary0" : "0", "rotary1" : "0", "rotary2" : "0", "ultrasound1" : "0", "ultrasound2" : "0" };

    var waitingFor = [],
        waitingForValue = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 },
        clientWaitingForInput = { "button0" : 99, "button1" : 99, "button2" : 99, "button3" : 99, "button4" : 99, "button5" : 99, "button6" : 99, "button7" : 99,"slider0" : 99, "slider1" : 99, "slider2" : 99, "rotary0" : 99, "rotary1" : 99, "rotary2" : 99, "ultrasound1" : 99, "ultrasound2" : 99 };

    var activeClients = { "client0" : false , "client1" : false , "client2" : false };

    var connectedPlayers = { "player1" : false , "player2" : false , "player3" : false };


     //Home made module
    var mqqtclient = require("./mqttclient"),
        selectButtons = require("./selectbutton");
        //mqttsubclient = require("./mqttsubclient");


var latestTopic = '';

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

// MQTT Server

var thisMqttServer = mqtt.createServer(function(client) {

    var self = this;

    if (self.clients === undefined) self.clients = {};

    client.on('connect', function (packet) {

            console.log(packet.client, ':  - MQTT Client has Connected');

                    client.connack({

                            returnCode: 0

                    });

            client.id = packet.client;

            self.clients[client.id] = client;

    });

    client.on('publish', function (packet) {

        for (var k in self.clients) {

                self.clients[k].publish({topic: packet.topic, payload: packet.payload});

                        var splitTopic = packet.topic.split("/"),
                            topic =  splitTopic[1],
                            aID = splitTopic[0];

                            if (topicDouble[topic] === true) {

                                if ( topic != "keepAlive" ){


                                mqttController( aID, topic, packet.payload);

                                }
                            } else {
                        
                                topicDouble[topic] = true;
                            }
        }
    });


    client.on('subscribe', function (packet) {

        var granted = [];

        for (var i = 0; i < packet.subscriptions.length; i++) {

                 granted.push(packet.subscriptions[i].qos);

        }

        client.suback({ granted: granted });

    });

    client.on('pingreq', function (packet) {

            client.pingresp();

    });

    client.on('disconnect', function (packet) {

            client.stream.end();

    });

    client.on('close', function (err) {

            delete self.clients[client.id];

    });

    client.on('error', function (err) {

            client.stream.end();

            console.log('error!');

    });

}).listen(mqttPort);

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

    topicDouble[topic] = false;

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
    setButtonNames( "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle");

    io.sockets.emit('names', buttonNames);

    

    (function () {



        //if ( )
        messageReady();
        console.log("Array of items being watched", waitingFor);

    setTimeout(arguments.callee, 5000);

    })();



}
function messageReady () {

        //console.log("Making message...");

    var preparedMessage = selectButtons.newInstruction();

        //console.log(preparedMessage);

    var messageToSend = preparedMessage[0],
        inputId = preparedMessage[1], //id of input eg button5, rotary2
        buttonType = preparedMessage[2],
        newState = preparedMessage[3].toString(),
        randomPlayer = Math.floor(Math.random() * (3) + 0 );
        randomMillis = Math.floor(Math.random() * (4500) + 3500);
        clientSent = "client" + randomPlayer.toString();

        
        //console.log( "random Millis : ", randomMillis);
        //console.log( "client to send to :  ", clientSent);

        //console.log("List of active clients: ", activeClients);

        if ( activeClients[clientSent] != true ) {


            if (buttonType != "button" ){

                waitingForValue[inputId] = newState;

            }

            waitingFor.push(inputId);
        
            clientWaitingForInput[inputId] = randomPlayer;

            //console.log("WAITING FOR THESE BUTTONS", waitingFor);

            io.sockets.socket(clients[randomPlayer]).emit('instruction', messageToSend );
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
        whichClient = "client" + clientWaitingForInput[input].toString();

        clearTimeout(timeOutIds[input]);

        io.sockets.socket(clients[clientWaitingForInput[input]]).emit('instruction', "EMPTY STRING" );

        activeClients[whichClient] = false;

        waitingFor.splice(waitingTopicPos, 1);
        
        waitingForValue[input] = 99;
        clientWaitingForInput[input] = 99;
}
function checkArray ( arr, obj ) {

    for ( var i = 0; i < arr.length; i++ ) {

        if (arr[i] == obj)return true;

    }
}


function losePoints ( ammount ){

}

function setButtonNames ( btn0, btn1, btn2, btn3 , btn4 , btn5, btn6, btn7, sp0, sp1, sp2, rp0, rp1, rp2, u1, u2 ) {

        buttonNames.button0 = btn0;
        buttonNames.button1 = btn1;
        buttonNames.button2 = btn2;
        buttonNames.button3 = btn3;
        buttonNames.button4 = btn4;
        buttonNames.button5 = btn5;
        buttonNames.button6 = btn6;
        buttonNames.button7 = btn7;

        buttonNames.slider0 = sp0;
        buttonNames.slider1 = sp1;
        buttonNames.slider2 = sp2;

        buttonNames.rotary0 = rp0;
        buttonNames.rotary1 = rp1;
        buttonNames.rotary2 = rp2;

        //buttonNames.ultrasound1 = u1;
        //buttonNames.ultrasound2 = u2;
}

function setInstructions ( message) {

    instructions.player1 = message;
    instructions.player2 = message;
    instructions.player3 = message;
}

mqttKeepAlive(15000);
exports.buttonMap = buttonMap;
exports.buttonNames = buttonNames;
