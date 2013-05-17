var app = require("./app"),
    mqtt = require('mqttjs');

var topicDouble = { "button0" : false, "button1" : false, "button2" : false, "button3" : false, "button4" : false, "button5" : false, "button6" : false, "button7" : false, "slider0" : false, "slider1" : false, "slider2" : false, "rotary0" : false, "rotary1" : false, "rotary2" : false, "ultrasound1" : false, "ultrasound2" : false };

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

                                    app.mqttController( aID, topic, packet.payload);

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

}).listen(app.mqttPort);

exports.topicDouble = topicDouble;