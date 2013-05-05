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

                            ultrasonicHeight( value , 1);
                            $("#ul" + 2).text(value);
                        });

                        socket.on('ultrasound' + 2, function ( value) {

                            ultrasonicHeight( value , 2);
                            $("#ul" + 1).text(value);
                        });

                

            });


    function ultrasonicHeight ( value , id ) {

        thisValue = value;
        thisId = id;
        console.log("ultrasound", thisId, ": ", value);



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


});