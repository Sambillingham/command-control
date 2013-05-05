$(function() {

    var socket = io.connect('http://192.168.0.20:8080');

            var accellValues = { x: 0, y: 0, d: 0 };

 
            socket.on('connect', function () {

                        socket.on('button' + 2, function (value) {

                            colorChanger(value, 2);
                        
                        });
                        socket.on('button' + 3, function (value) {

                            colorChanger(value, 3);
                        
                        });
                        socket.on('button' + 4, function (value) {

                            colorChanger(value, 4);
                        
                        });
                        socket.on('button' + 5, function (value) {

                            colorChanger(value, 5);
                        
                        });
                        socket.on('button' + 6, function (value) {

                            colorChanger(value, 6);
                        
                        });

                        socket.on('slider'+ 1, function (value) {


                            sliderChange(value, 1);
                        });

                        socket.on('ultrasound' + 1, function ( value) {

                            console.log("ultrasound1: ", value);
                        });

                        socket.on('ultrasound' + 2, function ( value) {

                            console.log("ultrasound2: ", value);
                        });

                

            });



            // Do we have accelerometer support?
            if (window.DeviceMotionEvent !== undefined) {

                $("#welcome").removeClass("notMobile");

                // Gyrate
                window.ondeviceorientation = function(event) {

                    var deviceDirection = Math.floor(event.alpha),
                        deviceRollY     = Math.floor(event.beta),
                        deviceRollX     = Math.floor(event.gamma);

                            accellValues.x = deviceRollX;
                            accellValues.y = deviceRollY;
                            accellValues.d = deviceDirection;

                            socket.emit('sendAccellValues' , accellValues );

                        $("body").css("background-color", "rgb("+(255-accellValues.y)+","+(55+accellValues.y)+","+20+")");

                };


            } else {

                    // NO accelerometer support
                    $("#welcome").addClass("notMobile").append("<h1>controllers require a mobile device</h1>");

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


});