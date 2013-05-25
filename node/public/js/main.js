$(function() {

    var socket = io.connect('http://192.168.0.20:8080');

    var buttonMap = { "rocker0" : undefined , "rocker1" : undefined, "rocker2" : undefined, "rocker3" : undefined, "rocker4" : undefined,
                    "rocker5" : undefined, "rocker6" : undefined, "rocker7" : undefined, "toggle0" : undefined, "toggle1" : undefined,
                    "toggle2" : undefined, "toggle3" : undefined, "toggle4" : undefined, "slider0" : undefined, "slider1" : undefined,
                    "slider2" : undefined, "slider3" : undefined, "rotary0" : undefined, "rotary1" : undefined, "rotary2" : undefined,
                    "rotary3" : undefined, "ultrasound0" : undefined, "keySwitch0" : undefined, "redButton0" : undefined,
                    "missileSwitch0" : undefined };

    var pathArray = window.location.pathname.split( '/' );
    var playerCheck = pathArray[1],
        currentInterval = 0;

    console.log(playerCheck);


            socket.on('connect', function () {

                socket.emit('playerID', playerCheck);

                socket.on('map', function ( mapValues) {

                    buttonMapChecker(mapValues);   

                });
                
                socket.on( 'instruction' , function ( instr ) {

                    if ( instr.reset === true ){

                        window.clearInterval(currentInterval);

                        $("#incomming").text("");
                        $(".timer").css("width", "100%");

                    } else {


                        runTimers(instr.timer);
                        $("#incomming").text(instr.message);

                    }
                    $(".timer").css("width", "100%");
                });

                socket.on ('names', function ( names) {
 
                    mapNewNames(names);


                });
                socket.on('new-level', function (level ) {

                    newLevel(level);
                });

                socket.on ('health', function (status) {

                    moveHealth( status);
                });

                socket.on ('end-game', function (stats) {

                    

                        window.location = "/end";
                        
                });

                socket.on('stats', function ( stats ) {

                        console.log(stats);
                        
                        $("#levels").text(stats.levelsCompleted);
                        $("#switches").text(stats.switches);
                        $("#pots").text(stats.pots);
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

    function newLevel ( level ) {

        $(".level").addClass("show-banner");
        $("#level-num").text(level);

        setTimeout( function() {

            $(".level").removeClass("show-banner");
        }, 4300);

    }

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

    function runTimers ( time ) {

        console.log(time);

        var barWidth = window.innerWidth,
            pixelsInInterval = 3,
            intervalSteps = barWidth/pixelsInInterval,
            removeIntervalTime = Math.floor((time/intervalSteps)),
            currentWith = 0,
            newWidth = 0;

            console.log("timer interval", removeIntervalTime);
            currentInterval = window.setInterval( moveTimerBar, removeIntervalTime );

            
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

        $("#btn0name").text(allInputNames.rocker0);
        $("#btn1name").text(allInputNames.rocker1);
        $("#btn2name").text(allInputNames.toggle0);
        $("#btn3name").text(allInputNames.rocker2);
        $("#btn4name").text(allInputNames.rocker3);
        $("#btn5name").text(allInputNames.toggle1);
        $("#btn6name").text(allInputNames.toggle2);
        $("#btn7name").text(allInputNames.rocker4);
        $("#btn8name").text(allInputNames.toggle3);
        $("#btn9name").text(allInputNames.rocker5);
        $("#btn10name").text(allInputNames.rocker6);
        $("#btn11name").text(allInputNames.toggle4);
        $("#btn12name").text(allInputNames.rocker7);

        $("#slider0name").text(allInputNames.slider0);
        $("#slider1name").text(allInputNames.slider1);
        $("#slider2name").text(allInputNames.slider2);
        $("#slider3name").text(allInputNames.slider3);

        $("#rotary0name").text(allInputNames.rotary0);
        $("#rotary1name").text(allInputNames.rotary1);
        $("#rotary2name").text(allInputNames.rotary2);
        $("#rotary3name").text(allInputNames.rotary3);

    }

    function buttonMapChecker ( mapValues) {

        console.log(mapValues);

        if ( mapValues.rocker0 != buttonMap.rocker0 ) {

            colorChanger(mapValues.rocker0, 0);

         } else if ( mapValues.rocker1 != buttonMap.rocker1 ) {
            
            colorChanger(mapValues.rocker1, 1);

         } else if ( mapValues.toggle0 != buttonMap.toggle0 ) {
            
            colorChanger(mapValues.toggle0, 2);

         } else if ( mapValues.rocker2 != buttonMap.rocker2 ) {
            
            colorChanger(mapValues.rocker2, 3);

         } else if ( mapValues.rocker3 != buttonMap.rocker3 ) {
            
            colorChanger(mapValues.rocker3, 4);

         } else if ( mapValues.toggle1 != buttonMap.toggle1 ) {
            
            colorChanger(mapValues.toggle1, 5);

         } else if ( mapValues.toggle2 != buttonMap.toggle2 ) {
            
            colorChanger(mapValues.toggle2, 6);

         } else if ( mapValues.rocker4 != buttonMap.rocker4 ) {
            
            colorChanger(mapValues.rocker4, 7);

         } else if ( mapValues.toggle3 != buttonMap.toggle3 ) {
            
            colorChanger(mapValues.toggle3, 8);

         } else if ( mapValues.rocker5 != buttonMap.rocker5 ) {
            
            colorChanger(mapValues.rocker5, 9);

         } else if ( mapValues.rocker6 != buttonMap.rocker6 ) {
            
            colorChanger(mapValues.rocker6, 10);

         } else if ( mapValues.toggle4 != buttonMap.toggle4 ) {
            
            colorChanger(mapValues.toggle4, 11);

         } else if ( mapValues.rocker7 != buttonMap.rocker7 ) {
            
            colorChanger(mapValues.rocker7, 12);

         } else if ( mapValues.slider0 != buttonMap.slider0 ) {
            
            sliderChange(mapValues.slider0, 0);

         } else if ( mapValues.slider1 != buttonMap.slider1 ) {
            
            sliderChange(mapValues.slider1, 1);

         } else if ( mapValues.slider2 != buttonMap.slider2 ) {
            
            sliderChange(mapValues.slider2, 2);

         } else if ( mapValues.slider3 != buttonMap.slider3 ) {
            
            sliderChange(mapValues.slider3, 3);

         }else if ( mapValues.rotary0 != buttonMap.rotary0 ) {
            
            rotaryChange(mapValues.rotary0, 0);

         } else if ( mapValues.rotary1 != buttonMap.rotary1 ) {
            
            rotaryChange(mapValues.rotary1, 1);

         } else if ( mapValues.rotary2 != buttonMap.rotary2 ) {
            
            rotaryChange(mapValues.rotary2, 2);

         } else if ( mapValues.rotary3 != buttonMap.rotary3 ) {
            
            rotaryChange(mapValues.rotary3, 3);

         } 

         // else if ( mapValues.ultrasound1 != buttonMap.ultrasound1 ) {
            
         //    ultrasonicHeight( mapValues.ultrasound1 , 1);

         // } else if ( mapValues.ultrasound2 != buttonMap.ultrasound2 ) {
            
         //    ultrasonicHeight( mapValues.ultrasound2 , 2);
         // }

         buttonMap = mapValues;
    }

});