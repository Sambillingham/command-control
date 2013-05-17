
var mqqtPubClient = require("./mqttpubclient"),
    app = require("./app"),
    messageController = require("./messagecontroller"),
    mqttBroker = require("./mqttbroker"),
    removeMessage = require("./removemessage");

function mqttController (id, topic, packet) {

    var incommingTopic = topic + "",
        waitingTopicPos = 0,
        buttonType = incommingTopic.slice(0, -1);

    mqttBroker.topicDouble[topic] = false;

    console.log("ID: ", id, "TOPIC: ", topic, "PACKET: ", packet);

    console.log( " incomming topic: ", incommingTopic );
    console.log("Array of items being watched", messageController.waitingFor);

    if ( app.checkArray(messageController.waitingFor, incommingTopic) === true ) {

        console.log( incommingTopic, ":  item was found in array");
        console.log( "Type of input is: --> ", buttonType, "  <--");

        if ( buttonType == "button") {

            removeMessage.checkPlayerAndRemove(topic);
            console.log("Button was accepted");

        } else {

            if ( packet === messageController.waitingForValue[topic]) {

                console.log("slider/rotary was accepted");
                removeMessage.checkPlayerAndRemove(topic );

            } else {

                console.log("Wrong roatry/slider value. !Rejected!");
                app.losePoints(1);
            }

        }

    } else {

        console.log("Wrong switch. !Rejected!");
        app.losePoints(1);// wrong button pressed (aka not found in waiting for array)
    
    }

    switch ( topic ) {

        case "button0" :
            app.buttonMap.button0 = packet;
        break;
        case "button1" :
            app.buttonMap.button1 = packet;
        break;
        case "button2" :
            app.buttonMap.button2 = packet;
        break;
        case "button3" :
            app.buttonMap.button3 = packet;
        break;
        case "button4" :
            app.buttonMap.button4 = packet;
        break;
        case "button5" :
            app.buttonMap.button5 = packet;
        break;
        case "button6" :
            app.buttonMap.button6 = packet;
        break;
        case "button7" :
            app.buttonMap.button7 = packet;
        break;
        case "slider0" :
            app.buttonMap.slider0 = packet;
        break;
        case "slider1" :
            app.buttonMap.slider1 = packet;
        break;
        case "slider2" :
            app.buttonMap.slider2 = packet;
        break;
        case "rotary0" :
            app.buttonMap.rotary0 = packet;
        break;
        case "rotary1" :
            app.buttonMap.rotary1 = packet;
        break;
        case "rotary2" :
            app.buttonMap.rotary2 = packet;
        break;
        // case "ultrasound1" :
        //     app.buttonMap.ultrasound1 = packet;
        // break;
        // case "ultrasound2" :
        //     app.buttonMap.ultrasound2 = packet;
        // break;


    }

    app.io.sockets.emit('map', app.buttonMap);
}

function mqttKeepAlive (keepAliveTimer) {

    (function () {

        mqqtPubClient.publishOnClient("1/keepAlive" , "1");


    setTimeout(arguments.callee, keepAliveTimer);

    })();
}


mqttKeepAlive(15000);
exports.mqttController = mqttController;