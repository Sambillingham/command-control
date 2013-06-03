$(document).ready(function() {
      

    var video = $('#video');
    var socket = io.connect('http://178.79.132.119:8081');

         socket.on('connect', function () {
                console.log('connection Made');

                socket.on('change gravity', function () {
                        console.log('recivied Gravity socket');


                        $('#overlay').removeClass('hidden').addClass('show');

                            
                                 video.get(0).play();
                            
                        setTimeout(function () {


                            $('#vid-over').removeClass('hidden').addClass('show');

                        }, 1700);

                        setTimeout(function () {


                            $('#vid-over').removeClass('show').addClass('hidden');
                            
                        }, 4500);

                        setTimeout(function () {

                            $('#overlay').removeClass('show').addClass('hidden');

                        }, 6700);

                        Gravity.init();

                        setTimeout(function() {


                        Gravity.reset();

                        }, 7200);
                     

                });

                socket.on('disconnect', function () {

                });

            });

            $("#gravity").click(function() {

                    

                    socket.emit('gravity');
                    console.log('clicked gravity');

            });

});

var Gravity = {

            init: function() {

                    $('#makefall').stop().animate({
                        marginTop: 400+"px"
                    }, {
                        duration: 1000,
                        easing: "easeOutBounce"
                    });
            },

            reset: function() {

                $('#makefall').stop().animate({

                        marginTop: "0px"
                    }, {
                        duration: 1000,
                        easing: "easeOutBounce"
                });

            }
}

