var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false });

    var socketsPort = 8080,
        mqttPort = 8085, // need to be diffrent to socketsPort
        serverAddress = "127.0.0.1";

        // Export earlier for mqqt client to connect on startup
        exports.serverAddress = serverAddress;
        exports.mqttPort = mqttPort;

    var clients = [];
    var buttonMap = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 };

    var activeClients = { "client0" : false , "client1" : false , "client2" : false };

    var connectedPlayers = { "player1" : false , "player2" : false , "player3" : false };

    var resetInstruction = { "message" : "" , "timer" : "" , "reset" : true };

       //Modules
    var mqqtclient = require("./mqttclient"),
        selectButtons = require("./selectbutton"),
        names = require("./names"),
        mqttBroker = require("./mqttbroker"),
        mqttController = require("./mqttcontroller"),
        messageController = require("./messagecontroller");

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


function engageLevel () {

    console.log('Engaging Level');

    names.setButtonNames( "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle");

    (function () {


        messageController.messageReady();
        console.log("Array of items being watched", messageController.waitingFor);

    setTimeout(arguments.callee, 1000);

    })();



}

function checkPlayerAndRemove ( input ) {

    var waitingTopicPos = messageController.waitingFor.indexOf(input),
        whichClient = "client" + messageController.whichcClientWanted[input].toString();

        clearTimeout(messageController.timeOutIds[input]);

        io.sockets.socket(clients[messageController.whichcClientWanted[input]]).emit('instruction', resetInstruction );

        activeClients[whichClient] = false;

        messageController.waitingFor.splice(waitingTopicPos, 1);
        
        messageController.waitingForValue[input] = 99;
        messageController.whichcClientWanted[input] = 99;
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
exports.checkPlayerAndRemove = checkPlayerAndRemove;
exports.checkArray = checkArray;
exports.losePoints = losePoints;
exports.activeClients = activeClients;
exports.clients = clients;