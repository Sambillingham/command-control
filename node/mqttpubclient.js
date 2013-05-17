var mqtt = require('mqttjs');

var app = require("./app");

var thisMqttClient = '',
    defaultTopic = '/default',
    defaultPayload = "I'm a payload";

function runClient () {

            thisMqttClient = mqtt.createClient( app.mqttPort, app.serverAddress, function (err, client) {

                var defaultTopic;

                if ( err ) {

                        console.log(err , " CLIENT = Unable to connect to broker");
                        process.exit(1);

                }
                client.connect({

                         client: "Node-Publish-Client"

                });

                client.on('connack', function (packet) {

                    if (packet.returnCode === 0) {

                            client.publish({

                                    topic: defaultTopic,

                                    payload: defaultPayload
                                
                            });

                    } else {

                            console.log('connack error %d', packet.returnCode);

                            process.exit(-1);

                    }
                });

                client.on('close', function () {

                        process.exit(0);

                });

                client.on('error', function (e) {

                        console.log('error %s', e);

                        process.exit(-1);

                });
        });

}
runClient();

function publishOnClient ( topicName , payloadInfo ) {

        thisMqttClient.publish( {

                topic: topicName,
                
                payload: payloadInfo


        });

}

exports.thisMqttClient = thisMqttClient;
exports.runClient = runClient;
exports.publishOnClient = publishOnClient;