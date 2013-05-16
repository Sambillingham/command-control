var mqtt = require('mqttjs');

var thisMqttSubClient = '',
    defaultTopic = '1/keepAlive';

function subClient () {

        thisMqttSubClient = mqtt.createClient(mqttPort, serverAddress, function ( err, client) {

          if (err) {

            console.log("Unable to connect to broker");
            process.exit(1);

          }

            client.connect({

                client: "Node-Subscribe-Client",

                keepalive: 3000

            });

            client.on('connack', function ( packet ) {

                if (packet.returnCode === 0) {

                    client.subscribe({

                        topic: defaultTopic

                    });

                } else {

                    console.log('connack error %d', packet.returnCode);
                    process.exit(-1);

                }
            });

            client.on('publish', function (packet) {

                //console.log('%s\t%s', packet.topic, packet.payload);

            });

            client.on('close', function() {
                process.exit(0);
            });

            client.on('error', function(e) {
                console.log('error %s', e);
                process.exit(-1);
            });
        });

}

function subscribeTo( topicName ) {

    thisMqttSubClient.subscribe( {

            topic: topicName
    });

    thisMqttSubClient.on('publish', function (packet) {

        console.log('%s\t%s', packet.topic, packet.payload);

    });

}

subClient();

exports.subscribeTo = subscribeTo;

