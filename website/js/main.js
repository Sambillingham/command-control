

$(function() {


    //window.console.log("can't touch this");

        if($(".touch").length) {

            $(".splash-header").css("height", 480);

        } else {

            $(".splash-header").css("height", window.innerHeight);

        }
        
        $(".scroll-button").css("margin-top", (window.innerHeight / 2 ) - 175);

        $(".heading-logo").css("margin-top", (window.innerHeight / 2 ) - 150 );

        $(".responsive-video").fitVids();

        $(".scroll-button, .splash-header").click( function () {

            $(".header-container").removeClass('dark-header');

            $('html, body').animate({

                scrollTop: $("#nav-start").offset().top

            },800);
        });

        $(".scroll").click(function(event){

            event.preventDefault();
            //calculate destination place

            var dest = 0;
        
            if ($(this.hash).offset().top > $(document).height()-$(window).height()) {
              
                dest = ( $(document).height()-$(window).height() ) - 125 ;
            
            } else {
              
                dest = ($(this.hash).offset().top) - 125;
        }
            //go to destination
            $('html,body').animate({

                scrollTop: dest

            }, 600,'swing');

        });


         if ($('.no-touch').length ) {
            
            var sticky = document.querySelector('.sticky');
            var origOffsetY = sticky.offsetTop;

            function onScroll() {

                if ( (window.scrollY >= origOffsetY) === true ) {

                    sticky.classList.add('fixed');
                    $(".replace-header").addClass('replace-h');
                    $(".header-container").removeClass('dark-header');

                }  else {

                    sticky.classList.remove('fixed');
                    $(".replace-header").removeClass('replace-h');
                    $(".header-container").addClass('dark-header');

                }
                                              
            }

            document.addEventListener('scroll', onScroll);

        } else {


            $(".header-container").removeClass('dark-header');

        
        }




});