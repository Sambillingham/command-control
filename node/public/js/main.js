$(function() {

    var socket = io.connect('http://192.168.0.20:8080');

            var accellValues = { x: 0, y: 0, d: 0 };

 
            socket.on('connect', function () {

            
                socket.on('button2', function (value) {

                    if(value == 1){

                        $("#button2").removeClass("button-off").addClass("button-on");


                    } else {

                        $("#button2").removeClass("button-on").addClass("button-off");

                    }
                });


                socket.on('button4', function (value) {

                    if(value == 1){

                        $("#button4").removeClass("button-off").addClass("button-on");


                    } else {

                        $("#button4").removeClass("button-on").addClass("button-off");

                    }
                });

                socket.on('disconnect', function () {
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


});