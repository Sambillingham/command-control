$(function() {

    var socket = io.connect('http://192.168.0.20:8080');

    var buttonMap = {};
    var pathArray = window.location.pathname.split( '/' );
    var playerCheck = pathArray[1];

    console.log(playerCheck);

 
            socket.on('connect', function () {

                socket.emit('playerID', playerCheck);

                        

                socket.on('map', function ( mapValues) {

                    
                    console.log(buttonMap);


                     if ( mapValues.button3 != buttonMap.button3 ) {

                        colorChanger(mapValues.button3, 3);

                     } else if ( mapValues.button4 != buttonMap.button4 ) {
                        
                        colorChanger(mapValues.button4, 4);

                     } else if ( mapValues.button5 != buttonMap.button5 ) {
                        
                        colorChanger(mapValues.button5, 5);

                     } else if ( mapValues.slider1 != buttonMap.slider1 ) {
                        
                        sliderChange(mapValues.slider1, 1);

                     } else if ( mapValues.ultrasound1 != buttonMap.ultrasound1 ) {
                        
                        ultrasonicHeight( mapValues.ultrasound1 , 1);

                     } else if ( mapValues.ultrasound2 != buttonMap.ultrasound2 ) {
                        
                        ultrasonicHeight( mapValues.ultrasound2 , 2);
                     }

                     buttonMap = mapValues;

                });
                    
                    socket.on( 'instruction' , function ( instruction ) {

                        displayInstructions(instruction);
                    });

                    socket.on ('names', function ( names) {

                        mapNewNames(names);
                    });

                    socket.on('disconect', function () {

                        socket.emit('playerID', playerCheck + "d");

                    });
                

            });
    
    // function displayControls ( map ){

    //         ultrasonicHeight( map.ultrasound1 , 1);

    //         ultrasonicHeight( map.ultrasound2 , 2);

    //         sliderChange(map.slider1, 1);

    //         colorChanger(map.button2, 2);
    //         colorChanger(map.button3, 3);
    //         colorChanger(map.button4, 4);
    // }

    $("#start").click( function () {

        console.log("Starting...");
        socket.emit('start', 1);


    });

    function displayInstructions ( inst ) {

        $("#incomming").text(inst);


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

        if ( thisValue == 3 ){

            $("#slider"+ thisId).removeClass("button-off").removeClass("button-med").addClass("button-on");

        } else if ( thisValue == 2 ){

            $("#slider"+ thisId).removeClass("button-on").removeClass("button-off").addClass("button-med");

        } else if ( thisValue == 1) {

            $("#slider"+ thisId).removeClass("button-on").removeClass("button-med").addClass("button-off");
        }
    }

    function mapNewNames ( names ) {

        allInputNames = names;

        $("#btn3name").text(allInputNames.button3);
        $("#btn4name").text(allInputNames.button4);
        $("#btn5name").text(allInputNames.button5);

    }


});