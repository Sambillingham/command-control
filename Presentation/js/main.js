$(function () {

        Reveal.addEventListener( 'with-logo', function() {
            $(".static-logo").removeClass("hidden");
            console.log("custom event fired");
        });

        Reveal.addEventListener('move-3', function () {

	            setTimeout( function () {

	                window.location = "index.html#/3";

	            }, 5000);

        });

        Reveal.addEventListener('move-4', function () {

	            setTimeout( function () {

	                window.location = "index.html#/4";

	            }, 5000);

        });

        Reveal.addEventListener('move-5', function () {

	            setTimeout( function () {

	                window.location = "index.html#/5";

	            }, 5000);

        });
         Reveal.addEventListener('move-6', function () {

	            setTimeout( function () {

	                window.location = "index.html#/6";

	            }, 5000);

        });

        
});