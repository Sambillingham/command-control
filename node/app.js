var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false }),
    mqtt = require('mqttjs');

    socketsPort = 8080,
    mqttPort = 8085, // need to be diffrent to socketsPort
    serverAddress = "127.0.0.1";

    servoPosition = 0;

    //Home made module
    var mqqtclient = require("./mqqtclient");

var latestTopic = '';

server.listen(socketsPort);



app.configure(function() {

        app.use(express.static(__dirname + '/public'));
});
app.get('/', function (req, res) {

        res.sendfile(__dirname + '/index.html');
});
app.get('/vr', function (req, res) {

        res.sendfile(__dirname + '/vr.html');
});
app.get('/mobile', function (req, res) {

        res.sendfile(__dirname + '/mobile.html');
});
app.get('/controls', function (req, res) {

        res.sendfile(__dirname + '/control.html');
});



    io.sockets.on('connection', function (socket) {

            (function () { 

               // console.log(socket.id);
               //  socket.emit('testingTopic', latestTopic);
                

                setTimeout(arguments.callee, 1500);

            })(); 

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

        console.log('Published Packet ', packet);

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
        
            util.log('error!');

    });

}).listen(mqttPort);


function mqttController (id, topic, packet) {

    console.log("ID: ", id, "TOPIC: ", topic, "PACKET: ", packet);

    io.sockets.emit(topic, packet);


}

function sendServoInfo (position) {

    var x = position.x,
        y = position.y,
        d = position.d;

        if ( y > 0 && y < 180 ){

            //console.log("positon of Y: ", y*2);
            servoPosition = y*2;
        }
}
