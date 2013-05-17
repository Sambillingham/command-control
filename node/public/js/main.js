$(function() {

    var socket = io.connect('http://192.168.0.20:8080');

    var buttonMap = {};
    var pathArray = window.location.pathname.split( '/' );
    var playerCheck = pathArray[1],
        currentInterval = 0;

    console.log(playerCheck);


            socket.on('connect', function () {

                socket.emit('playerID', playerCheck);

                socket.on('map', function ( mapValues) {

                    buttonMapChecker( mapValues);    

                });
                
                socket.on( 'instruction' , function ( instruction ) {

                    thisInstruction = instruction;
                    
                    console.log(thisInstruction);

                    if ( thisInstruction.reset === true ) {

                        window.clearInterval(currentInterval);
                    }

                    displayInstructions(thisInstruction);
                });

                socket.on ('names', function ( names) {
 
                    mapNewNames(names);


                });

                socket.on ('health', function (status) {

                    moveHealth( status);
                });

                socket.on ('end-game', function (stats) {

                    

                        window.location = "/end";
                    
                });

                socket.on('disconect', function () {

                    socket.emit('playerID', playerCheck + "d");

                });
                

            });

    $("#start").click( function () {

        console.log("Starting...");
        socket.emit('start', 1);

    });
    $("#stop").click( function () {

        console.log("stopping...");
        socket.emit('stop', 1);

    });

    $("#levels").text();
    $("#switches").text();
    $("#sliders").text();
    $("#rotarys").text();


    function moveHealth ( health ) {

        var maxHealth = health.max,
            currentHealth = health.currentH,
            percRemain = (currentHealth/maxHealth)*100;
            displayPerc = percRemain.toString()+"%"

            console.log(displayPerc);

        $(".health").css("width", displayPerc);

        if ( percRemain < 70 && percRemain >= 40 ){

            $(".health").css("background-color", "#f7e12c");

        } else if ( percRemain < 40 ) {

            $(".health").css("background-color", "#F75B07");

        } 

    }

    function displayInstructions ( inst ) {

        var timerValue = Math.floor(inst.timer/ 100);
            timerValue = timerValue/10;


        $("#incomming").text(inst.message);
        $(".timer").css("width", "100%");

        if ( inst.reset !== true ){

            runTimers(timerValue);

        }

    }
    function runTimers ( time ) {

        var remainingTime = time,
            barWidth = window.innerWidth;
            pixelsInInterval = 3;
            intervalSteps = barWidth/pixelsInInterval;
            removeIntervalTime = Math.floor((time * 1000)/intervalSteps);
            currentWith = 0;
            newWidth = 0;

            if ( removeIntervalTime !== 0 ){

                $(".timer").css("width", barWidth);
                console.log("timer", removeIntervalTime);
                currentInterval = window.setInterval( moveTimerBar, removeIntervalTime );
            }
            
    }
    function moveTimerBar() {

            currentWith = parseInt($(".timer").css("width"));
            
            newWidth = currentWith - 3;

            $(".timer").css("width", newWidth);
    }
    function ultrasonicHeight ( value , id ) {

        thisValue = value;
        thisId = id;
        console.log("ultrasound", thisId, ": ", value);
        $("#ul" + id).text(value);


        if ( thisValue == 1 ){

            $("#ir"+ thisId).css("height", "75");

        } else if ( thisValue == 2 ){

            $("#ir"+ thisId).css("height", "150");

        } else if ( thisValue == 3 ){

            $("#ir"+ thisId).css("height", "225");

        } else if ( thisValue == 4 ){

            $("#ir"+ thisId).css("height", "300");
        }
         else if ( thisValue == 5 ){

            $("#ir"+ thisId).css("height", "375");

        } else {
            $("#ir"+ thisId).css("height", "0");
        }


    }
    function colorChanger ( value , id ) {

        thisValue = value;
        thisId = id;

        if(thisValue == 1){

                $("#button" + thisId).removeClass("button-off").addClass("button-on");


            } else {

                $("#button" + thisId).removeClass("button-on").addClass("button-off");

            }
    }

    function sliderChange ( value, id ) {

        thisValue = value;
        thisId = id;

        if ( thisValue == 4 ){

            $("#slider"+ thisId).removeClass("button-off").removeClass("button-val-2").removeClass("button-val-3").addClass("button-on");

        } else if ( thisValue == 3 ){

            $("#slider"+ thisId).removeClass("button-on").removeClass("button-off").removeClass("button-val-2").addClass("button-val-3");

        } else if ( thisValue == 2) {

            $("#slider"+ thisId).removeClass("button-on").removeClass("button-val-3").removeClass("button-off").addClass("button-val-2");

        } else if ( thisValue == 1 ) {

            $("#slider"+ thisId).removeClass("button-on").removeClass("button-val-2").removeClass("button-val-3").addClass("button-off");
        }
    }

    function rotaryChange ( value, id ) {

        thisValue = value;
        thisId = id;

        $("#rotary" + thisId + "num").text(thisValue);
    }

    function mapNewNames ( names ) {

        allInputNames = names;

        $("#btn0name").text(allInputNames.button0);
        $("#btn1name").text(allInputNames.button1);
        $("#btn2name").text(allInputNames.button2);
        $("#btn3name").text(allInputNames.button3);
        $("#btn4name").text(allInputNames.button4);
        $("#btn5name").text(allInputNames.button5);
        $("#btn6name").text(allInputNames.button6);
        $("#btn7name").text(allInputNames.button7);

        $("#slider0name").text(allInputNames.slider0);
        $("#slider1name").text(allInputNames.slider1);
        $("#slider2name").text(allInputNames.slider2);

        $("#rotary0name").text(allInputNames.rotary0);
        $("#rotary1name").text(allInputNames.rotary1);
        $("#rotary2name").text(allInputNames.rotary2);

    }

    function buttonMapChecker ( mapValues) {

        console.log(mapValues);

        if ( mapValues.button0 != buttonMap.button0 ) {

            colorChanger(mapValues.button0, 0);

         } else if ( mapValues.button1 != buttonMap.button1 ) {
            
            colorChanger(mapValues.button1, 1);

         } else if ( mapValues.button2 != buttonMap.button2 ) {
            
            colorChanger(mapValues.button2, 2);

         } else if ( mapValues.button3 != buttonMap.button3 ) {
            
            colorChanger(mapValues.button3, 3);

         } else if ( mapValues.button4 != buttonMap.button4 ) {
            
            colorChanger(mapValues.button4, 4);

         } else if ( mapValues.button5 != buttonMap.button5 ) {
            
            colorChanger(mapValues.button5, 5);

         } else if ( mapValues.button6 != buttonMap.button6 ) {
            
            colorChanger(mapValues.button6, 6);

         } else if ( mapValues.button7 != buttonMap.button7 ) {
            
            colorChanger(mapValues.button7, 7);

         } else if ( mapValues.slider0 != buttonMap.slider0 ) {
            
            sliderChange(mapValues.slider0, 0);

         } else if ( mapValues.slider1 != buttonMap.slider1 ) {
            
            sliderChange(mapValues.slider1, 1);

         } else if ( mapValues.slider2 != buttonMap.slider2 ) {
            
            sliderChange(mapValues.slider2, 2);

         } else if ( mapValues.rotary0 != buttonMap.rotary0 ) {
            
            rotaryChange(mapValues.rotary0, 0);

         } else if ( mapValues.rotary1 != buttonMap.rotary1 ) {
            
            rotaryChange(mapValues.rotary1, 1);

         } else if ( mapValues.rotary2 != buttonMap.rotary2 ) {
            
            rotaryChange(mapValues.rotary2, 2);

         } 

         // else if ( mapValues.ultrasound1 != buttonMap.ultrasound1 ) {
            
         //    ultrasonicHeight( mapValues.ultrasound1 , 1);

         // } else if ( mapValues.ultrasound2 != buttonMap.ultrasound2 ) {
            
         //    ultrasonicHeight( mapValues.ultrasound2 , 2);
         // }

         buttonMap = mapValues;
    }

});