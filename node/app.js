var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false }),
    mqtt = require('mqttjs');

    socketsPort = 8080,
    mqttPort = 8085, // need to be diffrent to socketsPort
    serverAddress = "127.0.0.1";

    servoPosition = 0;
    button2ready = 0;
    button4ready = 0;

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

    // Sockets Server
 
    io.sockets.on('connection', function (socket) {

            (function () { // ANONYMOUS SELF CALLING FUNCTION 1.5 SECS

               
                socket.emit('testingTopic', latestTopic);
                

                setTimeout(arguments.callee, 1500);

            })(); // END ANONYMOUS FUNCTION

                    (function () { 
                        if ( button2ready == 1 ) {

                            socket.emit('button2', 1);

                        } else {

                            
                            socket.emit('button2', 0);
                        }
                        if ( button4ready == 1 ) {

                            socket.emit('button4', 1);

                        } else {

                            
                            socket.emit('button4', 0);
                        }
                    

                        setTimeout(arguments.callee, 200);

                    })();

            socket.on('sendAccellValues', function (data) {

                    sendServoInfo(data);

                    


                     if (servoPosition < 10){

                        setTimeout( function () {

                            mqqtclient.publishOnClient(5+'/low', '9');

                        },700);
                    }
                    if (servoPosition > 50 && servoPosition < 100){

                        setTimeout( function () {

                            mqqtclient.publishOnClient(5+'/med', '9');

                        },700);
                    }
                    if (servoPosition > 140){

                            setTimeout( function () {

                                mqqtclient.publishOnClient(5+'/high', '9');
                            }, 500);
                    }

                  
                  
            });

            

      });

    // END sockets Server


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

        console.log('this is a pub packet: ', packet);

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

    if ( topic == "button2" ) {

        if ( packet == 1){

            button2ready = 1;

        } else {

            
            button2ready = 0;
        }
    }

    if ( topic == "button4" ) {

        if ( packet == 1){

            button4ready = 1;

        } else {

            
            button4ready = 0;
        }
    }


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