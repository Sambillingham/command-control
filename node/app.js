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
        buttonMap = { "button0" : 0, "button1" : 0, "button2" : 0, "button3" : 0, "button4" : 0, "button5" : 0, "button6" : 0, "button7" : 0,"slider0" : 0, "slider1" : 0, "slider2" : 0, "rotary0" : 0, "rotary1" : 0, "rotary2" : 0, "ultrasound1" : 0, "ultrasound2" : 0 },
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
app.get('/p1start', function (req, res) {

        res.sendfile(__dirname + '/p1start.html');
});
app.get('/end', function (req, res) {

        res.sendfile(__dirname + '/end.html');
});
app.get('/test', function (req, res) {

        res.sendfile(__dirname + '/test.html');
});
app.get('/p3-r', function (req, res) {

        res.sendfile(__dirname + '/p3-r.html');
});

    io.sockets.on('connection', function (socket) {

            socket.on('playerID', function (id) {

                if ( id == "player1" || id == "player2" || id == "player3" ) {

                    clients.push(socket.id);
                    console.log("clients: ", clients);
                    connectedPlayers[id] = true;
                    console.log("connected : ", connectedPlayers);

                    if ( connectedPlayers.player1 == true && connectedPlayers.player2 == true && connectedPlayers.player3 == true ){

                        //levelSystem.startGame();
                    }

                } else {

                    nonPlayingClients.push(socket.id);
                    console.log("NON PLAYING CLIENTS : ", nonPlayingClients);

                    if ( id == "end" ) {

                        socket.emit('stats', levelSystem.stats);
                    }
                }               

            });

            socket.on('start', function () {

                console.log("Start Recivied");
                levelSystem.startGame();


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