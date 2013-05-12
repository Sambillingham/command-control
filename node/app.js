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

    var buttonMap = { "button3" : 0, "button4" : 0, "button5" : 0, "slider1" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };
    var buttonNames = { "button3" : "0", "button4" : "0", "button5" : "0", "slider1" : "0", "ultrasound1" : "0", "ultrasound2" : "0" };

    var waitingFor = [],
        waitingForMap = { "button3" : 0, "button4" : 0, "button5" : 0, "slider1" : 0, "ultrasound1" : 0, "ultrasound2" : 0 },
        waitingForMapPlayers = { "button3" : 0, "button4" : 0, "button5" : 0, "slider1" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };

    var connectedPlayers = { "player1" : false , "player2" : false , "player3" : false };


     //Home made module
    var mqqtclient = require("./mqqtclient");
    var selectButtons = require("./selectbutton");

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

        //console.log('Published Packet ', packet);

        for (var k in self.clients) {

                self.clients[k].publish({topic: packet.topic, payload: packet.payload});

                        var topicRemoveSlash = packet.topic.split("/"),
                            whichAttribute =  topicRemoveSlash[1],
                            aID = (topicRemoveSlash[0]);

                            mqttController( aID, whichAttribute, packet.payload);
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

    console.log("ID: ", id, "TOPIC: ", topic, "PACKET: ", packet);

    io.sockets.emit(topic, packet);

    //console.log( " incomming topic: ", incommingTopic );
    //console.log("Array of items being watched", waitingFor);

    if ( checkArray(waitingFor, incommingTopic) === true ) {

        console.log( incommingTopic, "  item was found in array");
        console.log( buttonType);

        if ( buttonType == "button") {

        waitingTopicPos = waitingFor.indexOf(topic);
        waitingFor.splice(topic, 1);

        checkPlayerAndRemove(topic);

        } else {

            if ( packet === waitingForMap[topic]) {

                waitingTopicPos = waitingFor.indexOf(topic);
                waitingFor.splice(topic, 1);
                waitingForMap[topic] = 99;

                checkPlayerAndRemove(topic);

            } else {

                losePoints(1);
            }

        }
    }

    switch ( topic ) {

        case "button3" :
            buttonMap.button3 = packet;
        break;
        case "button4" :
            buttonMap.button4 = packet;
        break;
        case "button5" :
            buttonMap.button5 = packet;
        break;
        case "slider1" :
            buttonMap.slider1 = packet;
        break;
        case "ultrasound1" :
            buttonMap.ultrasound1 = packet;
        break;
        case "ultrasound2" :
            buttonMap.ultrasound2 = packet;
        break;


    }
    //console.log(buttonMap);
    io.sockets.emit('map', buttonMap);


}

function engageLevel () {

    console.log('Engaging Level');
    setButtonNames("Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shields", "armour plating");

    io.sockets.emit('names', buttonNames);

    

    (function () {

        messageReady();


    setTimeout(arguments.callee, 10000);

    })();



}
function messageReady () {

        console.log("Making message...");

    var messageReady = selectButtons.newInstruction(),
        messageToSend = messageReady[0],
        button = messageReady[1],
        buttonType = messageReady[2],
        newState = messageReady[3].toString(),
        randomSocket = Math.floor(Math.random() * (3) + 0 );
        randomMillis = Math.floor(Math.random() * (4500) + 3500);

        if (buttonType != "button" ){

            waitingForMap[button] = newState;

        }
        console.log( "random Millis : ", randomMillis);

        waitingFor.push(button);

        io.sockets.socket(clients[randomSocket]).emit('instruction', messageToSend );
        console.log(messageToSend);
        waitingForMapPlayers[button] = clients[randomSocket];

        setTimeout( function () {


            var waitingTopicPos = waitingFor.indexOf(button);
            waitingFor.splice(button, 1);
            waitingForMap[button] = 99;

            io.sockets.socket(waitingForMapPlayers[button]).emit('instruction', "EMPTY STRING" );

        }, randomMillis );

        //console.log("Array of items being watched", waitingFor);
        //console.log("new states being waited for", waitingForMap);



}
function checkPlayerAndRemove ( button ) {

    io.sockets.socket(waitingForMapPlayers[button]).emit('instruction', "EMPTY STRING" );

}
function checkArray ( arr, obj ) {

    for ( var i = 0; i < arr.length; i++ ) {

        if (arr[i] == obj)return true;

    }
}


function losePoints ( ammount ){

}

function setButtonNames ( btn3 , btn4 , btn5, s1, u1, u2 ) {

        buttonNames.button3 = btn3;
        buttonNames.button4 = btn4;
        buttonNames.button5 = btn5;
        buttonNames.slider1 = s1;
        buttonNames.ultrasound1 = u1;
        buttonNames.ultrasound2 = u2;
}

function setInstructions ( message) {

    instructions.player1 = message;
    instructions.player2 = message;
    instructions.player3 = message;
}

mqttKeepAlive(15000);
exports.buttonMap = buttonMap;
exports.buttonNames = buttonNames;
