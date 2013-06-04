$(function () {

        Reveal.addEventListener( 'with-logo', function() {
            $(".static-logo").removeClass("hidden");
            console.log("custom event fired");
        });

        Reveal.addEventListener('move-2', function () {

            setTimeout( function () {

                window.location = "index.html#/2";

            }, 5000);

        });
});