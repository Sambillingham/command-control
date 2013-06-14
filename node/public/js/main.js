$(function() {

    //var socket = io.connect('http://192.168.0.20:8080');     // DEVELOPMENT
    var socket = io.connect('commandcontrol.sambillingham.com');      // PRODUCTION

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

    if ( playerCheck == "player2" ){

        $("html, body").animate({ scrollTop: 1 }, "fast");

    } else {

        $("html, body").animate({ scrollTop: 50 }, "fast");
    }
    

            socket.on('connect', function () {

                socket.emit('playerID', playerCheck);

                socket.on('map', function ( mapValues) {

                    buttonMapChecker(mapValues);
                    showArduinoConnection();  

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

                        switch (playerCheck) {

                        case "player1" :
                        window.location = "/end1";
                        break;
                        case "player2" :
                        window.location = "/end2";
                        break;
                        case "player3" :
                        window.location = "/end3";
                        break;    
                        }

                        
                        
                });

                socket.on('game-reset', function (data) {

                    switch (playerCheck) {

                        case "player1" :
                        window.location = "/player1";
                        break;
                        case "end1" :
                        window.location = "/player1";
                        break;
                        case "player2" :
                        window.location = "/player2";
                        break;
                        case "end2" :
                        window.location = "/player2";
                        break;
                        case "player3" :
                        window.location = "/player3";
                        break;   
                        case "end3" :
                        window.location = "/player3";
                        break;   
                        }

                });

                socket.on('stats', function ( stats ) {

                        console.log(stats);
                        
                        $("#levels").text(stats.levelsCompleted);
                        $("#switches").text(stats.switches);
                        $("#pots").text(stats.pots);
                });

                socket.on('no-start', function ( value ) {

                    if ( value === true ) {

                        $(".start-error").text("Not all Players are connected - reconnect");
                    }

                    setTimeout( function () {

                        $(".start-error").text("");

                    }, 3000);

                });

                socket.on('disconect', function () {

                    socket.emit('playerID', playerCheck + "d");

                });
                

            });

    $("#start").click( function () {

        console.log("Starting...");
        socket.emit('start', 1);

    });
    // $("#stop").click( function () {

    //     console.log("stopping...");
    //     socket.emit('stop', 1);

    // });

    if (playerCheck == "end1" || playerCheck == "end2" || playerCheck == "end3"  ) {

        setTimeout( function () {

                switch (playerCheck) {

                        
                        case "end1" :
                        window.location = "/player1";
                        break;
                        case "end2" :
                        window.location = "/player2";
                        break;  
                        case "end3" :
                        window.location = "/player3";
                        break;   
                }

                
        }, 20000);
    }

    function newLevel ( level ) {


        $(".connection-screen").removeClass("show");

        if (level === 1 ) {

            $(".starting-screen").addClass("show");

            setTimeout( function () {

                $(".starting-screen").removeClass("show");
                $(".level").addClass("show");
                $("#level-num").text(level);

                setTimeout( function() {

                    $(".level").removeClass("show");

                }, 9500);

            }, 10000 );

        } else {

             $(".level").addClass("show");
            $("#level-num").text(level);

            setTimeout( function() {

                    $(".level").removeClass("show");

            }, 9500);
        }

    }

    function showArduinoConnection () {

        $(".arduino-connection").text("Ship controls are are Active!");

        setTimeout( function () {

            $(".arduino-connection").text("");

        }, 5000);
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

    function imageChanger ( value, id) {

        thisId = id;
        thisValue = value;

        switch (thisId) {

            case 0 :
            case 9 :

                if ( thisValue == 1 ) {
                  
                  $("#button" + thisId).css("background", "url(/img/redRocker-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/redRocker-off.png)");

                }

            break;
            case 1 :
            case 12 :

                if ( thisValue == 1 ) {
              
                    $("#button" + thisId).css("background", "url(/img/greenRocker-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/greenRocker-off.png)");

                }
            break;
            case 2 :
            case 5 :
            case 6 :
            case 11 :

                if ( thisValue == 1 ) {
              
                    $("#button" + thisId).css("background", "url(/img/toggle-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/toggle-off.png)");

                }
            break;
            case 3 :
            case 4 :

                if ( thisValue == 1 ) {
              
                    $("#button" + thisId).css("background", "url(/img/smallRedRocker-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/smallRedRocker-off.png)");

                }
            break;
            case 7 :

                if ( thisValue == 1 ) {
              
                    $("#button" + thisId).css("background", "url(/img/roundRedRocker-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/roundRedRocker-off.png)");

                }
            break;
            case 8 :

                if ( thisValue == 1) {

                    $("#button" + thisId).css("background", "url(/img/black-toggle-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/black-toggle-off.png)");

                }
            break;
            case 10 : 

                if ( thisValue == 1 ) {
              
                    $("#button" + thisId).css("background", "url(/img/smallRedRockerVertical-on.png)");


                } else {

                    $("#button" + thisId).css("background", "url(/img/smallRedRockerVertical-off.png)");

                }


        }
    }
    function sliderChangeLarge ( value, id ) {

        thisValue = value;
        thisId = id;

        $("#slider"+ thisId).css("background", "url(/img/largeSlider-" + thisValue + ".png)");
        
    }
    function sliderChangeSmall( value, id ) {

        thisValue = value;
        thisId = id;

        $("#slider"+ thisId).css("background", "url(/img/smallSlider-" + thisValue + ".png)");
        
    }

    function rotaryChangeRed ( value, id ) {

        thisValue = value;
        thisId = id;

        $("#rotary" + thisId + "num").text(thisValue);
        $("#rotary" + thisId).css("background", "url(/img/redRotary-" + thisValue + ".png)");

    }

    function rotaryChangeSilver ( value, id ) {

        thisValue = value;
        thisId = id;

        $("#rotary" + thisId + "num").text(thisValue);
        $("#rotary" + thisId).css("background", "url(/img/silver-Rotary-" + thisValue + ".png)");

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

            imageChanger(mapValues.rocker0, 0);

         } else if ( mapValues.rocker1 != buttonMap.rocker1 ) {
            
            imageChanger(mapValues.rocker1, 1);

         } else if ( mapValues.toggle0 != buttonMap.toggle0 ) {
            
            imageChanger(mapValues.toggle0, 2);

         } else if ( mapValues.rocker2 != buttonMap.rocker2 ) {
            
            imageChanger(mapValues.rocker2, 3);

         } else if ( mapValues.rocker3 != buttonMap.rocker3 ) {
            
            imageChanger(mapValues.rocker3, 4);

         } else if ( mapValues.toggle1 != buttonMap.toggle1 ) {
            
            imageChanger(mapValues.toggle1, 5);

         } else if ( mapValues.toggle2 != buttonMap.toggle2 ) {
            
            imageChanger(mapValues.toggle2, 6);

         } else if ( mapValues.rocker4 != buttonMap.rocker4 ) {
            
            imageChanger(mapValues.rocker4, 7);

         } else if ( mapValues.toggle3 != buttonMap.toggle3 ) {
            
            imageChanger(mapValues.toggle3, 8);

         } else if ( mapValues.rocker5 != buttonMap.rocker5 ) {
            
            imageChanger(mapValues.rocker5, 9);

         } else if ( mapValues.rocker6 != buttonMap.rocker6 ) {
            
            imageChanger(mapValues.rocker6, 10);

         } else if ( mapValues.toggle4 != buttonMap.toggle4 ) {
            
            imageChanger(mapValues.toggle4, 11);

         } else if ( mapValues.rocker7 != buttonMap.rocker7 ) {
            
            imageChanger(mapValues.rocker7, 12);

         } else if ( mapValues.slider0 != buttonMap.slider0 ) {
            
            sliderChangeLarge(mapValues.slider0, 0);

         } else if ( mapValues.slider1 != buttonMap.slider1 ) {
            
            sliderChangeSmall(mapValues.slider1, 1);

         } else if ( mapValues.slider2 != buttonMap.slider2 ) {
            
            sliderChangeSmall(mapValues.slider2, 2);

         } else if ( mapValues.slider3 != buttonMap.slider3 ) {
            
            sliderChangeLarge(mapValues.slider3, 3);

         }else if ( mapValues.rotary0 != buttonMap.rotary0 ) {
            
            rotaryChangeRed(mapValues.rotary0, 0);

         } else if ( mapValues.rotary1 != buttonMap.rotary1 ) {
            
            rotaryChangeSilver(mapValues.rotary1, 1);

         } else if ( mapValues.rotary2 != buttonMap.rotary2 ) {
            
            rotaryChangeSilver(mapValues.rotary2, 2);

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