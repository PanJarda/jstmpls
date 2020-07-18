(function( window ) {

    function vibrate() {
        var res = window.navigator.vibrate(500);
        setTimeout(function() { window.alert( res )}, 1000);
    }

    window.addEventListener("load", function() {
        setTimeout( vibrate, 2000 );
    });

})(window || global);