var app = require("./app"),
    mqtt = require('mqttjs'),
    mqttController = require("./mqttcontroller");

var topicDouble = { "slider0" : false, "slider1" : false, "slider2" : false, "slider3" : false, "rotary0" : false, "rotary1" : false, "rotary2" : false, "rotary3" : false,  "ultrasound1" : false, "ultrasound2" : false };


char* slider[] = { "1/slider0", "1/slider1", "1/slider2", "1/slider3" };
    char* rotary[] = { "1/rotary0", "1/rotary1", "1/rotary2", "1/rotary3" };
    char* buttonTopics[] = { "1/rocker0", "1/rocker1", "1/toggle0", "1/rocker2", "1/rocker3", "1/toggle1", "1/toggle2", "1/rocker4", "1/rocker5", "1/rocker6", "1/toggle3", "1/toggle4", "1/rocker7" };
    char* ultrasoundTopics[] = { "1/ultrasound0" };
    char* extraTopics[] = { "keySwitch0", "redButton0", "missileSwitch0"}; 


var thisMqttServer = mqtt.createServer(function (client) {

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

                                    mqttController.mqttController( aID, topic, packet.payload);

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