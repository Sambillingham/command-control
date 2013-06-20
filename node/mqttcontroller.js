
var mqqtPubClient = require("./mqttpubclient"),
    app = require("./app"),
    messageController = require("./messagecontroller"),
    mqttBroker = require("./mqttbroker"),
    removeMessage = require("./removemessage"),
    helper = require("./helper"),
    pointsSystem = require("./pointssystem"),
    levelSystem = require("./levelsystem");

    var resetRequest = false;

function mqttController (id, topic, packet) {

    var incommingTopic = topic + "",
        waitingTopicPos = 0,
        buttonType = incommingTopic.slice(0, -1);

    mqttBroker.topicDouble[topic] = false;

    console.log("ID: ", id, "TOPIC: ", topic, "PACKET: ", packet);

    //console.log( " incomming topic: ", incommingTopic );
    //console.log("Array of items being watched", messageController.waitingFor);

    if ( helper.checkArray(messageController.waitingFor, incommingTopic) === true ) {

        console.log( incommingTopic, ":  item was found in array");
        console.log( "Type of input is: --> ", buttonType, "  <--");

        if ( buttonType == "toggle" || buttonType == "rocker") {

            removeMessage.checkPlayerAndRemove(topic);
            console.log("Button was accepted");
            levelSystem.stats.switches = levelSystem.stats.switches + 1;

        } else {

            if ( packet === messageController.waitingForValue[topic]) {

                console.log("slider/rotary was accepted");
                removeMessage.checkPlayerAndRemove(topic );

                levelSystem.stats.pots = levelSystem.stats.pots + 1;
                
            } else {

                if ( levelSystem.level.active === true ){

                    console.log("Wrong roatry/slider value. !Rejected!");
                    pointsSystem.losePoints(1);

                } else {

                    console.log("INPUT PRESSED - but level not active");
                }
            }

        }

    } else {

        if ( incommingTopic == "redButton0") {

            if ( resetRequest === false ){

                resetRequest = true;

                if ( levelSystem.level.active === true ) {

                    levelSystem.stopLevel();
                    levelSystem.fakeEnd();
                    app.io.sockets.emit('game-reset', true);

                        setTimeout( function () {

                            console.log('NEW GAME STARTED');
                            levelSystem.stats.levelsCompleted = 0;
                            levelSystem.stats.pots = 0;
                            levelSystem.stats.switches = 0;
                            levelSystem.startGame();
                            resetRequest = false;

                        }, 4000 );

                } else {

                    levelSystem.stopLevel();

                    app.io.sockets.emit('game-reset', true);

                        setTimeout( function () {

                            console.log('NEW GAME STARTED');
                            levelSystem.stats.levelsCompleted = 0;
                            levelSystem.stats.pots = 0;
                            levelSystem.stats.switches = 0;
                            levelSystem.startGame();
                            resetRequest = false;

                    }, 4000 );

                }


            } else {

                setTimeout( function () {

                    resetRequest = false;

                }, 2000);
            }

            


        } else if ( incommingTopic == "health6" || incommingTopic == "health5" || incommingTopic == "health4" || incommingTopic == "health3" || incommingTopic == "health2" || incommingTopic == "health1 ") {

            console.log(incommingTopic);
            
        } else if ( levelSystem.level.active === true ){

            console.log("Wrong switch. !Rejected!");
            pointsSystem.losePoints(1);// wrong button pressed (aka not found in waiting for array)
        
        } else {

            console.log("INPUT PRESSED - but level not active");

        }
    }

    switch ( topic ) {

        case "slider0" :
            app.buttonMap.slider0 = packet;
        break;
        case "slider1" :
            app.buttonMap.slider1 = packet;
        break;
        case "slider2" :
            app.buttonMap.slider2 = packet;
        break;
        case "slider3" :
            app.buttonMap.slider3 = packet;
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
        case "rotary3" :
            app.buttonMap.rotary3 = packet;
        break;
        case "rocker0" :
            app.buttonMap.rocker0 = packet;
        break;
        case "rocker1" :
            app.buttonMap.rocker1 = packet;
        break;
        case "rocker2" :
            app.buttonMap.rocker2 = packet;
        break;
        case "rocker3" :
            app.buttonMap.rocker3 = packet;
        break;
        case "rocker4" :
            app.buttonMap.rocker4 = packet;
        break;
        case "rocker5" :
            app.buttonMap.rocker5 = packet;
        break;
        case "rocker6" :
            app.buttonMap.rocker6 = packet;
        break;
        case "rocker7" :
            app.buttonMap.rocker7 = packet;
        break;
        case "toggle0" :
            app.buttonMap.toggle0 = packet;
        break;
        case "toggle1" :
            app.buttonMap.toggle1 = packet;
        break;
        case "toggle2" :
            app.buttonMap.toggle2 = packet;
        break;
        case "toggle3" :
            app.buttonMap.toggle3 = packet;
        break;
        case "toggle4" :
            app.buttonMap.toggle4 = packet;
        break;
        case "keySwitch0" :
            app.buttonMap.keySwitch0 = packet;
        break;
        case "redButton0" :
            app.buttonMap.redButton0 = packet;
        break;
        case "missileSwitch0" :
            app.buttonMap.missileSwitch0 = packet;
        break;
        case "ultrasound0" :
            app.buttonMap.ultrasound0 = packet;
        break;


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