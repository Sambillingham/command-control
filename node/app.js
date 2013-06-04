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

    var clients = [],
        nonPlayingClients = [],
        buttonMap = { "rocker0" : 0 , "rocker1" : 0, "rocker2" : 0, "rocker3" : 0, "rocker4" : 0, "rocker5" : 0, "rocker6" : 0,
                    "rocker7" : 0, "toggle0" : 0, "toggle1" : 0, "toggle2" : 0, "toggle3" : 0, "toggle4" : 0, "slider0" : 0,
                    "slider1" : 0, "slider2" : 0, "slider3" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "rotary3" : 0,
                    "ultrasound0" : 0, "keySwitch0" : 0, "redButton0" : 0, "missileSwitch0" : 0 },
        activeClients = { "client0" : false , "client1" : false , "client2" : false },
        connectedPlayers = { "player1" : false , "player2" : false , "player3" : false };

       //Modules
    var selectButtons = require("./selectbutton"),
        names = require("./names"),
        mqttBroker = require("./mqttbroker"),
        mqttController = require("./mqttcontroller"),
        messageController = require("./messagecontroller"),
        levelSystem = require("./levelsystem");

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
app.get('/end1', function (req, res) {

        res.sendfile(__dirname + '/end1.html');
});
app.get('/end2', function (req, res) {

        res.sendfile(__dirname + '/end2.html');
});
app.get('/end3', function (req, res) {

        res.sendfile(__dirname + '/end3.html');
});

    io.sockets.on('connection', function (socket) {

            socket.on('playerID', function (id) {

                if ( id == "player1" || id == "player2" || id == "player3" ) {      // IF socket that connects is on a player screen

                    clients.push(socket.id);        // Add csocket that just connected to list of players
                    console.log("clients: ", clients);
                    connectedPlayers[id] = true;        // set the player that connected to true
                    console.log("connected : ", connectedPlayers);

                } else {        // Not on player screen but will still need a socket connection

                    nonPlayingClients.push(socket.id);      // Adds socket to alternate list
                    console.log("NON PLAYING CLIENTS : ", nonPlayingClients);

                    if ( id == "end1" || id == "end2" || id =="end3") {

                        socket.emit('stats', levelSystem.stats);        // If the sreen is after a game is finished emit stats

                    }
                }               

            });

            socket.on('start', function () {        //Player requests to start game

                console.log("Start Recivied");

                if ( connectedPlayers.player1 == true && connectedPlayers.player2 == true && connectedPlayers.player3 == true ) {


                        levelSystem.startGame();

                } else {

                    socket.emit('no-start', true );
                }


            });

            socket.on('stop', function () {

                console.log("STOPPED! LEVEL");
                levelSystem.stopLevel();
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

exports.buttonMap = buttonMap;
exports.io = io;
exports.activeClients = activeClients;
exports.clients = clients;